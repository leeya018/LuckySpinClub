"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";

export default function UserInfo() {
  const [user] = useAuthState(auth);
  const [points, setPoints] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setPoints(doc.data().points);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error signing out", error);
      });
  };

  if (!user) return null;

  return (
    <div className="absolute top-4 left-4 flex items-center space-x-4">
      <div className="text-white">
        <span className="font-bold">{user.displayName}</span>
        <span className="ml-2">
          Points: {points !== null ? points : "Loading..."}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
