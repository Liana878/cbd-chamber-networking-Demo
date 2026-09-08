export const achievementRules = [
  {
    id: 1,
    key: "first-check-in",
    name: "First Check-In",
    description: "Complete your first venue check-in",
    points: 50,
    dynamic: true,
  },
  {
    id: 2,
    key: "venue-reviewer",
    name: "Venue Reviewer",
    description: "Leave 5 Google reviews for partner venues",
    points: 125,
    dynamic: false,
    mockProgress: 2,
    total: 5,
  },
  {
    id: 3,
    key: "explorer",
    name: "Explorer",
    description: "Visit 5 different venues",
    points: 100,
    dynamic: true,
    total: 5,
  },
  {
    id: 4,
    key: "social-butterfly",
    name: "Social Butterfly",
    description: "Check in 10 times",
    points: 150,
    dynamic: false,
    mockProgress: 7,
    total: 10,
  },
  {
    id: 5,
    key: "frequent-visitor",
    name: "Frequent Visitor",
    description: "Visit the same venue 5 times",
    points: 200,
    dynamic: false,
    mockProgress: 3,
    total: 5,
  },
] as const;

export const rewardRules = [
  {
    id: 1,
    name: "$10 Chamber Voucher",
    points: 500,
  },
  {
    id: 2,
    name: "$25 Chamber Voucher",
    points: 1000,
  },
  {
    id: 3,
    name: "VIP Event Access",
    points: 2000,
  },
] as const;
