// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyPaymentData(paymentData: any) {
  // In a real production environment, you would verify this data with Google's servers.
  // For the test environment, we'll do a basic check of the structure.

  if (!paymentData || typeof paymentData !== "object") {
    throw new Error("Invalid payment data");
  }

  if (
    !paymentData.paymentMethodData ||
    !paymentData.paymentMethodData.tokenizationData
  ) {
    throw new Error("Missing tokenization data");
  }

  // In test mode, we're particularly interested in the last 4 digits of the card
  const cardDetails = paymentData.paymentMethodData.info.cardDetails;
  console.log({
    cardDetails,
    ifDaata: !["1111", "4444", "3214"].includes(cardDetails),
  });
  if (!["1111", "4444", "3214"].includes(cardDetails)) {
    throw new Error("Invalid test card number");
  }

  console.log("Payment data verified (test mode):", paymentData);

  return paymentData;
}
