// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processPayment(paymentData: any, planId: string) {
  // In a real implementation, you would send this data to your
  // payment processor. For test mode, we'll simulate different outcomes
  // based on the last 4 digits of the card number.

  // Extract the last 4 digits of the card number
  const last4 = paymentData.paymentMethodData.info.cardDetails;
  console.log({ info: paymentData.paymentMethodData.info });

  console.log(`Processing payment for plan: ${planId}`);
  console.log(`Card last 4 digits: ${last4}`);

  // Simulate different outcomes based on the card number
  switch (last4) {
    case "3214": // Visa test card
      console.log("Visa test card detected");
      return {
        success: true,
        transactionId: "test_visa_" + Math.random().toString(36).substr(2, 9),
        userId: "user_" + Math.random().toString(36).substr(2, 9),
      };
    case "5454": // Mastercard test card
      console.log("Mastercard test card detected");
      return {
        success: true,
        transactionId:
          "test_mastercard_" + Math.random().toString(36).substr(2, 9),
        userId: "user_" + Math.random().toString(36).substr(2, 9),
      };
    case "0005": // Amex test card
      console.log("Amex test card detected");
      return {
        success: true,
        transactionId: "test_amex_" + Math.random().toString(36).substr(2, 9),
        userId: "user_" + Math.random().toString(36).substr(2, 9),
      };
    default:
      console.log("Unknown card type");
      throw new Error("Payment failed: Invalid test card");
  }
}
