"use client";

import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useEffect } from "react";

const rooms = [
  { id: "room1", name: "Beginner's Luck" },
  { id: "room2", name: "High Rollers" },
  { id: "room3", name: "Fortune's Wheel" },
];

export default function RoomSelection() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleJoinRoom = (roomId: string) => {
    if (user) {
      router.push(
        `/spinner?username=${encodeURIComponent(
          user.displayName || ""
        )}&roomId=${roomId}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-500">
        <div className="text-white text-2xl">Error: {error.message}</div>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the useEffect hook
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-500 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-teal-700">Select a Room</h1>
        <div className="space-y-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleJoinRoom(room.id)}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Join {room.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
