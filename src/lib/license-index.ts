import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { getAdminFirestore } from "./firebase-admin";

const COLLECTION = "licenseKeys";

function db(): Firestore {
  return getAdminFirestore();
}

export function normalizeLicenseKeyDocId(licenseKey: string): string {
  return licenseKey.trim().toUpperCase();
}

/** O(1) map: license key → user id */
export async function setLicenseIndex(uid: string, licenseKey: string): Promise<void> {
  const key = normalizeLicenseKeyDocId(licenseKey);
  if (!key) return;
  await db()
    .collection(COLLECTION)
    .doc(key)
    .set({ uid, updatedAt: FieldValue.serverTimestamp() });
}

export async function removeLicenseIndex(licenseKey: string): Promise<void> {
  const key = normalizeLicenseKeyDocId(licenseKey);
  if (!key) return;
  await db().collection(COLLECTION).doc(key).delete();
}

export async function getUidByLicenseKey(licenseKey: string): Promise<string | null> {
  const key = normalizeLicenseKeyDocId(licenseKey);
  if (!key) return null;
  const snap = await db().collection(COLLECTION).doc(key).get();
  if (!snap.exists) return null;
  return (snap.data()?.uid as string) ?? null;
}
