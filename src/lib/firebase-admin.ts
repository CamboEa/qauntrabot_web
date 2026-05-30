import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;
let db: Firestore | undefined;

function loadServiceAccount(): Record<string, unknown> | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    try {
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
  }

  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (path) {
    const full = resolve(process.cwd(), path);
    if (!existsSync(full)) {
      throw new Error(`FIREBASE_SERVICE_ACCOUNT_PATH not found: ${full}`);
    }
    return JSON.parse(readFileSync(full, "utf8")) as Record<string, unknown>;
  }

  return null;
}

export function getAdminFirestore(): Firestore {
  if (db) return db;

  const existing = getApps()[0];
  if (existing) {
    db = getFirestore(existing);
    db.settings({ ignoreUndefinedProperties: true });
    return db;
  }

  const serviceAccount = loadServiceAccount();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin not configured. Add FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON to .env (Firebase Console → Project settings → Service accounts → Generate new private key)."
    );
  }

  app = initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    projectId: (serviceAccount.project_id as string) ?? projectId,
  });

  db = getFirestore(app);
  // EA botStatus omits optional fields (undefined) — Firestore rejects those otherwise.
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}
