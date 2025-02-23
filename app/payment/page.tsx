"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import UserInfo from "@/components/UserInfo";
import { coinPlans, type PlanId } from "@/utils/coinPlans";
import { doc, updateDoc, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, loading, error] = useAuthState(auth);
  const [paymentsClient, setPaymentsClient] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const planId = searchParams.get("planId");
  console.log({ planId });
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.onload = onGooglePayLoaded;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [planId]);

  const onGooglePayLoaded = () => {
    const client = new window.google.payments.api.PaymentsClient({
      environment: "TEST",
    });
    setPaymentsClient(client);
  };

  const getGooglePaymentDataConfiguration = () => {
    try {
      if (!planId) throw new Error("no plan id ");
      const totalPrice = coinPlans[planId].price;
      return {
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: {
          // A valid merchant ID is required for production environments
          // For testing, you can use this test merchant ID
          merchantId: "12345678901234567890",
          merchantName: "Your Company Name",
        },
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: [
                "AMEX",
                "DISCOVER",
                "INTERAC",
                "JCB",
                "MASTERCARD",
                "VISA",
              ],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleGatewayMerchantId",
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: totalPrice.toString() + ".00",
          currencyCode: "USD",
          countryCode: "US",
        },
      };
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    if (!user || !planId) return;

    // Here you would integrate with your payment provider
    console.log(`Processing payment for plan: ${planId}`);

    const paymentDataRequest = getGooglePaymentDataConfiguration();
    const paymentData = await paymentsClient.loadPaymentData(
      paymentDataRequest
    );

    // Process the paymentData on your server
    const response = await fetch("/api/process-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentData, planId, userId: user.uid }),
    });

    const result = await response.json();

    if (result.error) {
      console.log(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    try {
      // Simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!user) throw new Error("user in null");
      // Update user's balance in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        points: increment(coinPlans[planId].coins),
      });
      router.push("/payment-success");

      alert(
        "Payment processed successfully! Your coins have been added to your balance."
      );
      // router.push("/rooms");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-500 py-8">
      <UserInfo />
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-teal-700">Payment</h1>
        <div className="mb-4">
          <p className="font-bold">Selected Plan:</p>
          <p>
            {coinPlans[planId]?.coins} coins for ${coinPlans[planId]?.price}
          </p>
        </div>
        {paymentsClient && (
          <Button
            onClick={handlePayment}
            disabled={loading || !planId}
            className="w-full"
          >
            {loading ? "Processing..." : "Pay with Google Pay"}
          </Button>
        )}
        {!paymentsClient && <p>Loading Google Pay...</p>}
      </div>
      <button
        onClick={() => router.push("/store")}
        className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 border-teal-600"
      >
        Back to Store
      </button>
    </div>
  );
}
