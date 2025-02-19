import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

export async function createOrUpdateUser(userId: string, displayName: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // User doesn't exist, create a new one
    await setDoc(userRef, {
      displayName,
      points: 10,
      createdAt: new Date(),
    });
  }
}

export async function getUserPoints(userId: string): Promise<number> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().points;
  }

  return 0;
}

export async function updateUserPoints(
  userId: string,
  pointChange: number
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    points: increment(pointChange),
  });
}
