import AuthenticatedLayout from "../authenticated-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Payment Successful!</h1>
        <p className="mb-6">
          Thank you for your purchase. Your account has been upgraded.
        </p>
        <Link href="/" passHref>
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </AuthenticatedLayout>
  );
}
