export const coinPlans = {
  plan_10coins: {
    coins: 10,
    price: 5,
    imageUrl:
      "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  plan_100coins: {
    coins: 100,
    price: 25,
    imageUrl:
      "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  plan_500coins: {
    coins: 500,
    price: 75,
    imageUrl:
      "https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  plan_1000coins: {
    coins: 1000,
    price: 105,
    imageUrl:
      "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
};

export type PlanId = keyof typeof coinPlans;
