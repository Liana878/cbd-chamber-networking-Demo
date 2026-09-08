import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { DemoUser, demoUsers } from "../data/demoUsers";
import { achievementRules, rewardRules } from "../data/gamification";
import { deriveAdminAnalytics } from "../data/adminAnalytics";
import type { AdminAnalytics } from "../data/adminAnalytics";
import { useAuth } from "./AuthContext";

const APP_STATE_STORAGE_KEY = "cbd-app-state-v1";
const BASE_CHECK_INS_TODAY = 456;
const EMPTY_USER_STATS = { totalPoints: 0, venueVisits: 0, checkInCount: 0 };

type CheckInSource =
  | "confirm_visit"
  | "qr_simulated"
  | "meeting_checkin"
  | "networking_meeting";
type RedemptionStatus = "available";

export interface CheckInRecord {
  id: string;
  userId: string;
  venueId: number;
  venueName: string;
  checkedInAt: string;
  pointsEarned: 50;
  source: CheckInSource;
  invitationId?: string;
}

export interface RedemptionRecord {
  id: string;
  userId: string;
  rewardId: number;
  rewardName: string;
  pointsSpent: number;
  redeemedAt: string;
  status: RedemptionStatus;
}

export type InvitationStatus = "pending" | "accepted" | "declined" | "completed";

export interface InvitationRecord {
  id: string;
  senderId: string;
  receiverId: string;
  venueId: number;
  venueName: string;
  date: string;
  time: string;
  purpose: string;
  note: string;
  reminder: boolean;
  status: InvitationStatus;
  createdAt: string;
  completedAt?: string;
  completedBy?: string;
  meetingOutcome?: string;
  followUpNotes?: string;
  networkingRewardGrantedAt?: string;
}

interface AddCheckInInput {
  venueId: number;
  venueName: string;
  source: CheckInSource;
}

interface CreateInvitationInput {
  receiverId: string;
  venueId: number;
  venueName: string;
  date: string;
  time: string;
  purpose: string;
  note: string;
  reminder: boolean;
}

interface CompleteInvitationMeetingInput {
  confirmAttendance: boolean;
  meetingOutcome?: string;
  followUpNotes?: string;
}

interface AppStateData {
  checkIns: CheckInRecord[];
  redemptions: RedemptionRecord[];
  invitations: InvitationRecord[];
}

export interface UserStats {
  totalPoints: number;
  venueVisits: number;
  checkInCount: number;
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  name: string;
  points: number;
}

export interface AchievementStatus {
  id: number;
  key: string;
  name: string;
  description: string;
  completed: boolean;
  points: number;
  progress?: number;
  total?: number;
  isMock: boolean;
}

export interface RewardStatus {
  id: number;
  name: string;
  points: number;
  available: boolean;
  redeemed: boolean;
}

export interface Voucher {
  id: string;
  rewardName: string;
  redeemedDate: string;
  status: RedemptionStatus;
}

interface AppStateContextType {
  users: typeof demoUsers;
  checkIns: CheckInRecord[];
  redemptions: RedemptionRecord[];
  invitations: InvitationRecord[];
  totalPoints: number;
  venueVisits: number;
  checkInsToday: number;
  weeklyCheckIns: Array<{ day: string; checkIns: number }>;
  recentCheckIns: Array<{ venue: string; date: string; points: string }>;
  leaderboard: LeaderboardEntry[];
  currentUserAchievements: AchievementStatus[];
  currentUserRewardStatus: RewardStatus[];
  currentUserVouchers: Voucher[];
  adminAnalytics: AdminAnalytics;
  getUserStats: (userId: string) => UserStats;
  addCheckIn: (input: AddCheckInInput) => CheckInRecord;
  redeemReward: (rewardId: number) => void;
  createInvitation: (input: CreateInvitationInput) => InvitationRecord | null;
  updateInvitationStatus: (
    invitationId: string,
    status: Extract<InvitationStatus, "accepted" | "declined">
  ) => InvitationRecord | null;
  completeInvitationMeeting: (
    invitationId: string,
    input: CompleteInvitationMeetingInput
  ) => InvitationRecord | null;
}

const weeklyCheckInsBase = [
  { day: "Mon", checkIns: 280 },
  { day: "Tue", checkIns: 340 },
  { day: "Wed", checkIns: 420 },
  { day: "Thu", checkIns: 380 },
  { day: "Fri", checkIns: 520 },
  { day: "Sat", checkIns: 390 },
  { day: "Sun", checkIns: 290 },
];

const fallbackRecentCheckIns = [
  { venue: "The Grounds of the City", date: "Today, 10:30 AM", points: "+50 pts" },
  { venue: "Single O Coffee", date: "Yesterday, 8:15 AM", points: "+50 pts" },
  { venue: "The Royal Exchange Café", date: "Apr 12, 2:00 PM", points: "+50 pts" },
];

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

function createRecordId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadAppState(): AppStateData {
  if (typeof window === "undefined") {
    return { checkIns: [], redemptions: [], invitations: [] };
  }

  try {
    const stored = window.localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!stored) return { checkIns: [], redemptions: [], invitations: [] };

    const parsed = JSON.parse(stored) as Partial<AppStateData>;
    return {
      checkIns: Array.isArray(parsed.checkIns)
        ? parsed.checkIns.filter((checkIn) => Boolean(checkIn.userId))
        : [],
      redemptions: Array.isArray(parsed.redemptions)
        ? parsed.redemptions.filter((redemption) => Boolean(redemption.userId))
        : [],
      invitations: Array.isArray(parsed.invitations)
        ? parsed.invitations.filter(
            (invitation) => Boolean(invitation.senderId) && Boolean(invitation.receiverId)
          )
        : [],
    };
  } catch {
    return { checkIns: [], redemptions: [], invitations: [] };
  }
}

function saveAppState(appState: AppStateData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(appState));
}

function isSameLocalDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function getDayLabel(date: Date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function formatRecentDate(checkedInAt: string) {
  const date = new Date(checkedInAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (isSameLocalDay(date, today)) return `Today, ${time}`;
  if (isSameLocalDay(date, yesterday)) return `Yesterday, ${time}`;

  return date.toLocaleDateString([], { month: "short", day: "numeric" }) + `, ${time}`;
}

function formatVoucherDate(redeemedAt: string) {
  return new Date(redeemedAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateUserStats(
  user: DemoUser,
  checkIns: CheckInRecord[],
  redemptions: RedemptionRecord[]
): UserStats {
  const userCheckIns = checkIns.filter((checkIn) => checkIn.userId === user.id);
  const userVenueCheckIns = userCheckIns.filter(
    (checkIn) => checkIn.source !== "networking_meeting"
  );
  const earnedPoints = userCheckIns.reduce(
    (total, checkIn) => total + checkIn.pointsEarned,
    0
  );
  const redeemedPoints = redemptions
    .filter((redemption) => redemption.userId === user.id)
    .reduce((total, redemption) => total + redemption.pointsSpent, 0);

  return {
    totalPoints: user.initialPoints + earnedPoints - redeemedPoints,
    venueVisits: user.initialVenueVisits + userVenueCheckIns.length,
    checkInCount: userCheckIns.length,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [appState, setAppState] = useState<AppStateData>(loadAppState);
  const { checkIns, redemptions, invitations } = appState;

  const currentUserCheckIns = useMemo(
    () => checkIns.filter((checkIn) => checkIn.userId === currentUser?.id),
    [checkIns, currentUser?.id]
  );

  const todayCheckIns = useMemo(() => {
    const today = new Date();
    return checkIns.filter((checkIn) => isSameLocalDay(new Date(checkIn.checkedInAt), today));
  }, [checkIns]);

  const weeklyCheckIns = useMemo(() => {
    const todayLabel = getDayLabel(new Date());
    return weeklyCheckInsBase.map((entry) =>
      entry.day === todayLabel
        ? { ...entry, checkIns: entry.checkIns + todayCheckIns.length }
        : entry
    );
  }, [todayCheckIns.length]);

  const recentCheckIns = useMemo(() => {
    const savedCheckIns = currentUserCheckIns
      .slice()
      .sort(
        (a, b) =>
          new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime()
      )
      .map((checkIn) => ({
        venue: checkIn.venueName,
        date: formatRecentDate(checkIn.checkedInAt),
        points: `+${checkIn.pointsEarned} pts`,
      }));

    return [...savedCheckIns, ...fallbackRecentCheckIns].slice(0, 3);
  }, [currentUserCheckIns]);

  const userStatsById = useMemo(
    () =>
      new Map(
        demoUsers.map((user) => [
          user.id,
          calculateUserStats(user, checkIns, redemptions),
        ])
      ),
    [checkIns, redemptions]
  );

  const getUserStats = useCallback(
    (userId: string) => userStatsById.get(userId) || EMPTY_USER_STATS,
    [userStatsById]
  );

  const currentUserStats = currentUser ? getUserStats(currentUser.id) : EMPTY_USER_STATS;

  const leaderboard = useMemo(
    () =>
      demoUsers
        .map((user) => ({
          userId: user.id,
          name: user.name,
          points: getUserStats(user.id).totalPoints,
        }))
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
    [getUserStats]
  );

  const currentUserAchievements = useMemo(() => {
    return achievementRules.map((achievement) => {
      if (achievement.key === "first-check-in") {
        const completed = currentUserStats.checkInCount >= 1;
        return {
          ...achievement,
          completed,
          progress: completed ? undefined : currentUserStats.checkInCount,
          total: completed ? undefined : 1,
          isMock: false,
        };
      }

      if (achievement.key === "explorer") {
        const total = achievement.total;
        const progress = Math.min(currentUserStats.venueVisits, total);
        const completed = progress >= total;
        return {
          ...achievement,
          completed,
          progress: completed ? undefined : progress,
          total: completed ? undefined : total,
          isMock: false,
        };
      }

      const progress = "mockProgress" in achievement ? achievement.mockProgress : undefined;
      const total = "total" in achievement ? achievement.total : undefined;

      return {
        ...achievement,
        completed: false,
        progress,
        total,
        isMock: true,
      };
    });
  }, [currentUserStats.checkInCount, currentUserStats.venueVisits]);

  const currentUserRewardStatus = useMemo(
    () =>
      rewardRules.map((reward) => ({
        ...reward,
        available: currentUserStats.totalPoints >= reward.points,
        redeemed: redemptions.some(
          (redemption) =>
            redemption.userId === currentUser?.id && redemption.rewardId === reward.id
        ),
      })),
    [currentUser?.id, currentUserStats.totalPoints, redemptions]
  );

  const currentUserVouchers = useMemo(
    () =>
      redemptions
        .filter((redemption) => redemption.userId === currentUser?.id)
        .sort(
          (a, b) =>
            new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
        )
        .map((redemption) => ({
          id: redemption.id,
          rewardName: redemption.rewardName,
          redeemedDate: formatVoucherDate(redemption.redeemedAt),
          status: redemption.status,
        })),
    [currentUser?.id, redemptions]
  );

  const adminAnalytics = useMemo(
    () => deriveAdminAnalytics(checkIns, invitations),
    [checkIns, invitations]
  );

  const addCheckIn = (input: AddCheckInInput) => {
    if (!currentUser) {
      throw new Error("Cannot add a check-in without a logged-in user");
    }

    const record: CheckInRecord = {
      id: createRecordId(),
      userId: currentUser.id,
      venueId: input.venueId,
      venueName: input.venueName,
      checkedInAt: new Date().toISOString(),
      pointsEarned: 50,
      source: input.source,
    };

    setAppState((current) => {
      const next = { ...current, checkIns: [record, ...current.checkIns] };
      saveAppState(next);
      return next;
    });

    return record;
  };

  const redeemReward = (rewardId: number) => {
    if (!currentUser) return;

    setAppState((current) => {
      const reward = rewardRules.find((item) => item.id === rewardId);
      if (!reward) return current;

      const alreadyRedeemed = current.redemptions.some(
        (redemption) =>
          redemption.userId === currentUser.id && redemption.rewardId === rewardId
      );
      if (alreadyRedeemed) return current;

      const stats = calculateUserStats(currentUser, current.checkIns, current.redemptions);
      if (stats.totalPoints < reward.points) return current;

      const redemption: RedemptionRecord = {
        id: createRecordId(),
        userId: currentUser.id,
        rewardId: reward.id,
        rewardName: reward.name,
        pointsSpent: reward.points,
        redeemedAt: new Date().toISOString(),
        status: "available",
      };
      const next = {
        ...current,
        redemptions: [redemption, ...current.redemptions],
      };
      saveAppState(next);
      return next;
    });
  };

  const createInvitation = (input: CreateInvitationInput) => {
    if (!currentUser || currentUser.id === input.receiverId) return null;

    const invitation: InvitationRecord = {
      id: createRecordId(),
      senderId: currentUser.id,
      receiverId: input.receiverId,
      venueId: input.venueId,
      venueName: input.venueName,
      date: input.date,
      time: input.time,
      purpose: input.purpose,
      note: input.note,
      reminder: input.reminder,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setAppState((current) => {
      const next = {
        ...current,
        invitations: [invitation, ...current.invitations],
      };
      saveAppState(next);
      return next;
    });

    return invitation;
  };

  const updateInvitationStatus = (
    invitationId: string,
    status: Extract<InvitationStatus, "accepted" | "declined">
  ) => {
    if (!currentUser) return null;

    let updatedInvitation: InvitationRecord | null = null;

    setAppState((current) => {
      const invitation = current.invitations.find((item) => item.id === invitationId);

      if (
        !invitation ||
        invitation.receiverId !== currentUser.id ||
        invitation.status !== "pending"
      ) {
        return current;
      }

      updatedInvitation = { ...invitation, status };
      const next = {
        ...current,
        invitations: current.invitations.map((item) =>
          item.id === invitationId ? updatedInvitation! : item
        ),
      };

      saveAppState(next);
      return next;
    });

    return updatedInvitation;
  };

  const completeInvitationMeeting = (
    invitationId: string,
    input: CompleteInvitationMeetingInput
  ) => {
    if (!currentUser || !input.confirmAttendance) return null;

    let completedInvitation: InvitationRecord | null = null;

    setAppState((current) => {
      const invitation = current.invitations.find((item) => item.id === invitationId);

      if (
        !invitation ||
        invitation.status !== "accepted" ||
        (invitation.senderId !== currentUser.id && invitation.receiverId !== currentUser.id)
      ) {
        return current;
      }

      const rewardAlreadyGranted =
        Boolean(invitation.networkingRewardGrantedAt) ||
        current.checkIns.some(
          (checkIn) =>
            checkIn.source === "networking_meeting" &&
            checkIn.invitationId === invitation.id
        );

      if (rewardAlreadyGranted) return current;

      const completedAt = new Date().toISOString();
      completedInvitation = {
        ...invitation,
        status: "completed",
        completedAt,
        completedBy: currentUser.id,
        meetingOutcome: input.meetingOutcome,
        followUpNotes: input.followUpNotes,
        networkingRewardGrantedAt: completedAt,
      };

      const senderReward: CheckInRecord = {
        id: createRecordId(),
        userId: invitation.senderId,
        venueId: invitation.venueId,
        venueName: invitation.venueName,
        checkedInAt: completedAt,
        pointsEarned: 50,
        source: "networking_meeting",
        invitationId: invitation.id,
      };
      const receiverReward: CheckInRecord = {
        id: createRecordId(),
        userId: invitation.receiverId,
        venueId: invitation.venueId,
        venueName: invitation.venueName,
        checkedInAt: completedAt,
        pointsEarned: 50,
        source: "networking_meeting",
        invitationId: invitation.id,
      };

      const next = {
        ...current,
        checkIns: [senderReward, receiverReward, ...current.checkIns],
        invitations: current.invitations.map((item) =>
          item.id === invitationId ? completedInvitation! : item
        ),
      };

      saveAppState(next);
      return next;
    });

    return completedInvitation;
  };

  return (
    <AppStateContext.Provider
      value={{
        users: demoUsers,
        checkIns,
        redemptions,
        invitations,
        totalPoints: currentUserStats.totalPoints,
        venueVisits: currentUserStats.venueVisits,
        checkInsToday: BASE_CHECK_INS_TODAY + todayCheckIns.length,
        weeklyCheckIns,
        recentCheckIns,
        leaderboard,
        currentUserAchievements,
        currentUserRewardStatus,
        currentUserVouchers,
        adminAnalytics,
        getUserStats,
        addCheckIn,
        redeemReward,
        createInvitation,
        updateInvitationStatus,
        completeInvitationMeeting,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
