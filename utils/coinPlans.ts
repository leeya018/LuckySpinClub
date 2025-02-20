export const coinPlans = {
  plan_10coins: { coins: 10, price: 5 },
  plan_100coins: { coins: 100, price: 25 },
  plan_500coins: { coins: 500, price: 75 },
  plan_1000coins: { coins: 1000, price: 105 },
};

export type PlanId = keyof typeof coinPlans;
