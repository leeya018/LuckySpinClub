"use client";

import { useSearchParams } from "next/navigation";
import Spinner from "../spinner";

export default function SpinnerPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const roomId = searchParams.get("roomId") || "";

  if (!username || !roomId) {
    return <div>Invalid parameters. Please go back to the login page.</div>;
  }

  return <Spinner username={username} roomId={roomId} />;
}
