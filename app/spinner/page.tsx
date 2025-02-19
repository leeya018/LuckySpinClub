"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Spinner from "../../components/spinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useEffect } from "react";

export default function SpinnerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const roomId = searchParams.get("roomId") || "";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  if (!user || !roomId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-500">
        <div className="text-white text-2xl">
          Invalid parameters. Please go back to the login page.
        </div>
      </div>
    );
  }

  return <Spinner username={user.displayName || "Anonymous"} roomId={roomId} />;
}
