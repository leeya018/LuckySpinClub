// This is a mock database for testing purposes
const mockDatabase: {
  [userId: string]: { subscription: string; subscriptionDate: Date };
} = {};

export async function updateUserSubscription(userId: string, planId: string) {
  // In a real implementation, you would update the user's subscription
  // in your actual database. For our test environment, we'll use a mock database.

  if (!userId || !planId) {
    throw new Error("Invalid user ID or plan ID");
  }

  // Update the mock database
  mockDatabase[userId] = {
    subscription: planId,
    subscriptionDate: new Date(),
  };

  console.log(`Updated subscription for user ${userId} to plan ${planId}`);
  console.log("Current mock database state:", mockDatabase);

  return true;
}

// Additional function to get user subscription (for testing purposes)
export async function getUserSubscription(userId: string) {
  if (!userId) {
    throw new Error("Invalid user ID");
  }

  return mockDatabase[userId] || null;
}
