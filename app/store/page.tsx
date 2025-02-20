"use client";

import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useEffect } from "react";
import UserInfo from "@/components/UserInfo";
import { coinPlans, type PlanId } from "@/utils/coinPlans";

export default function Store() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handlePurchase = (planId: PlanId) => {
    router.push(`/payment?planId=${planId}`);
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
      <UserInfo />
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-teal-700">Coin Store</h1>
        <div className="space-y-4">
          {Object.entries(coinPlans).map(([planId, plan]) => (
            <button
              key={planId}
              onClick={() => handlePurchase(planId as PlanId)}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Buy {plan.coins} coins for ${plan.price}
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push("/rooms")}
          className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 border-teal-600"
        >
          Back to Rooms
        </button>
      </div>
    </div>
  );
}
