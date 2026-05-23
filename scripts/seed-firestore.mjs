/**
 * Seed Firestore bots, demo users, and subscriptions (Firebase Admin).
 *
 * Prerequisites:
 *   FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env
 *
 * Usage:
 *   npm run seed:data
 *   npm run seed:data -- --wipe-extra-bots   # delete bot docs not in catalog
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { SEED_BOTS, SEED_PLANS, SEED_SUBSCRIPTIONS, SEED_USERS } from "./seed/catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    const hash = value.indexOf(" #");
    if (hash !== -1) value = value.slice(0, hash).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"));

const wipeExtraBots = process.argv.includes("--wipe-extra-bots");

function loadServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) return JSON.parse(json);
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!path) return null;
  const full = resolve(root, path);
  if (!existsSync(full)) throw new Error(`Service account not found: ${full}`);
  return JSON.parse(readFileSync(full, "utf8"));
}

function initAdmin() {
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    console.error(
      "Missing FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env"
    );
    process.exit(1);
  }
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return { db: getFirestore(), auth: getAuth() };
}

async function ensureUser(auth, db, { email, password, platform, displayName }) {
  let uid;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    console.log(`  User exists: ${email} (${uid})`);
  } catch (err) {
    if (err?.code !== "auth/user-not-found") throw err;
    const created = await auth.createUser({ email, password, displayName });
    uid = created.uid;
    console.log(`  Created user: ${email} (${uid})`);
  }

  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      uid,
      email,
      platform,
      displayName,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Created profile: users/${uid}`);
  }

  return uid;
}

async function seedPlans(db) {
  console.log("\nPlans:");
  for (const plan of SEED_PLANS) {
    const { id, ...data } = plan;
    const ref = db.collection("plans").doc(id);
    const exists = (await ref.get()).exists;
    await ref.set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
        ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true }
    );
    console.log(`  ${exists ? "Updated" : "Created"} plans/${id}`);
  }
}

async function seedBots(db) {
  console.log("\nBots:");
  const seedIds = new Set(SEED_BOTS.map((b) => b.id));

  for (const bot of SEED_BOTS) {
    const { id, ...data } = bot;
    const ref = db.collection("bots").doc(id);
    const exists = (await ref.get()).exists;
    await ref.set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
        ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true }
    );
    console.log(`  ${exists ? "Updated" : "Created"} bots/${id}`);
  }

  if (wipeExtraBots) {
    const snap = await db.collection("bots").get();
    for (const doc of snap.docs) {
      if (!seedIds.has(doc.id)) {
        await doc.ref.delete();
        console.log(`  Deleted extra bots/${doc.id}`);
      }
    }
  }
}

async function seedSubscriptions(db, auth, emailToUid) {
  console.log("\nSubscriptions:");
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")[0]
    ?.trim();

  const rows = SEED_SUBSCRIPTIONS.map((row) => {
    if (!row.email && adminEmail) return { ...row, email: adminEmail };
    return row;
  }).filter((row) => row.email);

  for (const row of rows) {
    const uid = emailToUid.get(row.email) ?? (await auth.getUserByEmail(row.email)).uid;
    emailToUid.set(row.email, uid);

    const validUntil = new Date(Date.now() + row.validUntilDays * 24 * 60 * 60 * 1000);

    const ref = db.collection("subscriptions").doc(uid);
    const exists = (await ref.get()).exists;
    await ref.set(
      {
        billingPeriod: row.billingPeriod,
        status: "active",
        mtAccountNumber: row.mtAccountNumber,
        licenseKey: row.licenseKey,
        validUntil,
        updatedAt: FieldValue.serverTimestamp(),
        ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true }
    );
    console.log(
      `  ${exists ? "Updated" : "Created"} subscriptions/${uid} (${row.email}, ${row.billingPeriod}, all bots)`
    );
  }
}

async function main() {
  const { db, auth } = initAdmin();
  const emailToUid = new Map();

  console.log("Seeding Firestore…");
  await seedPlans(db);
  await seedBots(db);

  console.log("\nUsers:");
  for (const user of SEED_USERS) {
    const uid = await ensureUser(auth, db, user);
    emailToUid.set(user.email, uid);
  }

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")[0]
    ?.trim();
  if (adminEmail) {
    try {
      const admin = await auth.getUserByEmail(adminEmail);
      emailToUid.set(adminEmail, admin.uid);
      const ref = db.collection("users").doc(admin.uid);
      if (!(await ref.get()).exists) {
        await ref.set({
          uid: admin.uid,
          email: adminEmail,
          platform: "admin",
          displayName: "Admin",
          createdAt: FieldValue.serverTimestamp(),
        });
        console.log(`  Ensured admin profile: ${adminEmail}`);
      }
    } catch (err) {
      if (err?.code === "auth/user-not-found") {
        console.warn(`  Admin email not in Auth yet — run npm run seed:admin first: ${adminEmail}`);
      } else {
        throw err;
      }
    }
  }

  await seedSubscriptions(db, auth, emailToUid);

  console.log("\nDone. Demo logins (change passwords after first use):");
  for (const u of SEED_USERS) {
    console.log(`  ${u.email} / ${u.password}`);
  }
  if (adminEmail) {
    console.log(`\nAdmin subscription assigned to: ${adminEmail}`);
  }
  console.log("\nSite will read bots/subscriptions from Firestore (no fallback catalogue).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
