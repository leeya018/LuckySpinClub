"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import UserInfo from "@/components/UserInfo";
import { coinPlans, type PlanId } from "@/utils/coinPlans";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, loading, error] = useAuthState(auth);
  const [planId, setPlanId] = useState<PlanId | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const planIdParam = searchParams.get("planId") as PlanId;
    if (planIdParam && planIdParam in coinPlans) {
      setPlanId(planIdParam);
    } else {
      router.push("/store");
    }
  }, [searchParams, router]);

  const handlePayment = async () => {
    if (!user || !planId) return;

    // Here you would integrate with your payment provider
    console.log(`Processing payment for plan: ${planId}`);

    try {
      // Simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user's balance in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        points: increment(coinPlans[planId].coins),
      });

      alert(
        "Payment processed successfully! Your coins have been added to your balance."
      );
      router.push("/rooms");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment. Please try again.");
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

  if (!user || !planId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-500">
        <div className="text-white text-2xl">
          Invalid parameters. Please go back to the store page.
        </div>
      </div>
    );
  }

  const plan = coinPlans[planId];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-500 py-8">
      <UserInfo />
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-teal-700">Payment</h1>
        <div className="mb-4">
          <p className="font-bold">Selected Plan:</p>
          <p>
            {plan.coins} coins for ${plan.price}
          </p>
        </div>
        <button
          onClick={handlePayment}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Process Payment
        </button>
        <button
          onClick={() => router.push("/store")}
          className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 border-teal-600"
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}
