export type UserRole = "member" | "staff";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  initialPoints: number;
  initialVenueVisits: number;
}

export const demoUsers: DemoUser[] = [
  {
    id: "member-001",
    email: "member1@example.com",
    name: "Sarah Williams",
    role: "member",
    initialPoints: 1240,
    initialVenueVisits: 24,
  },
  {
    id: "member-002",
    email: "member2@example.com",
    name: "Michael Chen",
    role: "member",
    initialPoints: 980,
    initialVenueVisits: 15,
  },
  {
    id: "member-003",
    email: "member3@example.com",
    name: "Emma Thompson",
    role: "member",
    initialPoints: 1560,
    initialVenueVisits: 31,
  },
  {
    id: "staff-001",
    email: "staff@example.com",
    name: "Chamber Staff",
    role: "staff",
    initialPoints: 600,
    initialVenueVisits: 10,
  },
];

export function findDemoUser(email: string, role: UserRole) {
  const normalizedEmail = email.trim().toLowerCase();
  const exactMatch = demoUsers.find(
    (user) => user.email === normalizedEmail && user.role === role
  );

  if (exactMatch) return exactMatch;

  return demoUsers.find((user) => user.role === role) || demoUsers[0];
}
