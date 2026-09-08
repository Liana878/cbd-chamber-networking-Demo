export interface MemberDirectoryEntry {
  id: number;
  userId?: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  bio: string;
  image: string;
  active: boolean;
  hasProfile: boolean;
  supportsInvitation: boolean;
  email?: string;
  linkedin?: string;
  expertise?: string[];
  memberSince?: string;
  networkingStats?: {
    meetings: number;
    connections: number;
  };
}

export const members: MemberDirectoryEntry[] = [
  {
    id: 0,
    userId: "member-001",
    name: "Sarah Williams",
    company: "Harbour Strategy Studio",
    title: "Founder & Business Strategist",
    industry: "Business Strategy",
    bio: "Helping local businesses sharpen their growth strategy, partnerships, and customer experience across the Sydney CBD.",
    email: "sarah@harbourstrategy.com.au",
    linkedin: "linkedin.com/in/sarahwilliams",
    image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&q=80",
    expertise: ["Business Strategy", "Partnerships", "Customer Experience"],
    memberSince: "2020",
    networkingStats: {
      meetings: 21,
      connections: 22,
    },
    active: true,
    hasProfile: true,
    supportsInvitation: true,
  },
  {
    id: 1,
    userId: "member-002",
    name: "Michael Chen",
    company: "Chen & Associates Legal",
    title: "Senior Partner",
    industry: "Legal Services",
    bio: "Specializing in commercial law and business contracts. Always happy to connect with fellow chamber members.",
    email: "michael.chen@chenlegal.com.au",
    linkedin: "linkedin.com/in/michaelchen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    expertise: ["Commercial Law", "Business Contracts", "Property Law"],
    memberSince: "2022",
    networkingStats: {
      meetings: 24,
      connections: 18,
    },
    active: true,
    hasProfile: true,
    supportsInvitation: true,
  },
  {
    id: 2,
    userId: "member-003",
    name: "Emma Thompson",
    company: "Thompson Architecture",
    title: "Principal Architect",
    industry: "Architecture",
    bio: "Creating sustainable commercial spaces in Sydney CBD. Looking to network with property developers.",
    email: "emma@thompsonarch.com.au",
    linkedin: "linkedin.com/in/emmathompson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    expertise: ["Sustainable Design", "Commercial Architecture", "Urban Planning"],
    memberSince: "2021",
    networkingStats: {
      meetings: 18,
      connections: 22,
    },
    active: true,
    hasProfile: true,
    supportsInvitation: true,
  },
  {
    id: 3,
    name: "James Rodriguez",
    company: "Digital Growth Partners",
    title: "Marketing Director",
    industry: "Marketing",
    bio: "Digital marketing strategist helping businesses grow online. Coffee chats welcome!",
    email: "james@digitalgrowth.com.au",
    linkedin: "linkedin.com/in/jamesrodriguez",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    expertise: ["Digital Marketing", "SEO", "Social Media Strategy"],
    memberSince: "2023",
    networkingStats: {
      meetings: 15,
      connections: 12,
    },
    active: false,
    hasProfile: true,
    supportsInvitation: true,
  },
  {
    id: 9,
    userId: "staff-001",
    name: "Chamber Staff",
    company: "Sydney CBD Chamber",
    title: "Community & Partnerships Manager",
    industry: "Chamber Operations",
    bio: "Supporting chamber members with local partnerships, networking programs, and business community initiatives across the Sydney CBD.",
    email: "staff@sydneycbdchamber.com.au",
    linkedin: "linkedin.com/company/sydney-cbd-chamber",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    expertise: ["Member Engagement", "Partnerships", "Business Community"],
    memberSince: "2019",
    networkingStats: {
      meetings: 32,
      connections: 41,
    },
    active: true,
    hasProfile: true,
    supportsInvitation: true,
  },
  {
    id: 4,
    name: "Sophie Martin",
    company: "Martin Financial Advisory",
    title: "Financial Advisor",
    industry: "Finance",
    bio: "Providing tailored financial solutions for SMEs. Eager to connect with business owners.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    active: true,
    hasProfile: false,
    supportsInvitation: false,
  },
  {
    id: 5,
    name: "David Park",
    company: "Park Consulting Group",
    title: "Management Consultant",
    industry: "Consulting",
    bio: "Helping businesses optimize operations and strategy. Always open to collaborative opportunities.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    active: false,
    hasProfile: false,
    supportsInvitation: false,
  },
  {
    id: 6,
    name: "Olivia Zhang",
    company: "Zhang Tech Solutions",
    title: "CEO & Founder",
    industry: "Technology",
    bio: "Building innovative software for Australian businesses. Love connecting with other founders.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    active: true,
    hasProfile: false,
    supportsInvitation: false,
  },
  {
    id: 7,
    name: "Lucas Wright",
    company: "Wright & Co Accounting",
    title: "Chartered Accountant",
    industry: "Accounting",
    bio: "Trusted advisor for tax and business advisory services. Happy to chat about business growth.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    active: false,
    hasProfile: false,
    supportsInvitation: false,
  },
  {
    id: 8,
    name: "Isabella Cooper",
    company: "Cooper HR Solutions",
    title: "HR Director",
    industry: "Human Resources",
    bio: "Passionate about people and workplace culture. Let's discuss talent strategies over coffee.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    active: true,
    hasProfile: false,
    supportsInvitation: false,
  },
];

export function getMemberById(id: string | number | undefined) {
  if (id === undefined) return undefined;
  return members.find((member) => member.id === Number(id));
}

export function getMemberIdentity(member: MemberDirectoryEntry) {
  return member.userId || `directory-member-${member.id}`;
}

export function getMemberByIdentity(identity: string | undefined) {
  if (!identity) return undefined;
  return members.find((member) => getMemberIdentity(member) === identity);
}
