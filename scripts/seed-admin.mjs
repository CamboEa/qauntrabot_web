/**
 * One-time seed: create admin Firebase Auth user + Firestore profile.
 * Usage (from project root):
 *   SEED_ADMIN_EMAIL=admin168@gmail.com SEED_ADMIN_PASSWORD='your-password' node scripts/seed-admin.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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

const email = (process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_EMAILS ?? "")
  .split(",")[0]
  ?.trim();
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error(
    "Missing SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (or ADMIN_EMAILS + SEED_ADMIN_PASSWORD)."
  );
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase env vars missing. Check .env");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function ensureProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    console.log("Firestore profile already exists:", uid);
    return;
  }
  await setDoc(ref, {
    uid,
    email,
    platform: "admin",
    displayName: "Admin",
    createdAt: serverTimestamp(),
  });
  console.log("Created Firestore user profile:", uid);
}

async function main() {
  let uid;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    uid = cred.user.uid;
    console.log("Created Firebase Auth user:", email, uid);
  } catch (err) {
    const code = err?.code ?? "";
    if (code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      uid = cred.user.uid;
      console.log("Auth user already exists; signed in:", email, uid);
    } else {
      console.error("Auth error:", code || err?.message || err);
      process.exit(1);
    }
  }

  try {
    await ensureProfile(uid);
  } catch (err) {
    if (err?.code === "permission-denied") {
      console.warn(
        "\nFirestore profile skipped (permission denied). Deploy firestore.rules from this repo in Firebase Console → Firestore → Rules, then run: npm run seed:admin"
      );
    } else {
      throw err;
    }
  }

  console.log("\nDone. Sign in at /admin/login with:", email);
  console.log("ADMIN_EMAILS is set in .env for:", email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
