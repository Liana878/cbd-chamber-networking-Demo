import type { CheckInRecord, InvitationRecord } from "../contexts/AppStateContext";

export const adminAnalyticsBaseline = {
  totalMembers: 2847,
  activeThisWeek: 1234,
  checkInsToday: 456,
  completedMeetings: 986,
  totalInvitations: 1847,
  acceptedMeetings: 1234,
  attendanceRate: 87,
  weeklyCheckIns: [
    { day: "Mon", checkIns: 280 },
    { day: "Tue", checkIns: 340 },
    { day: "Wed", checkIns: 420 },
    { day: "Thu", checkIns: 380 },
    { day: "Fri", checkIns: 520 },
    { day: "Sat", checkIns: 390 },
    { day: "Sun", checkIns: 290 },
  ],
  topVenues: [
    { name: "The Grounds of the City", checkIns: 1240, change: "+15%" },
    { name: "Single O Coffee", checkIns: 980, change: "+22%" },
    { name: "The Royal Exchange Café", checkIns: 856, change: "+8%" },
    { name: "Edition Coffee Roasters", checkIns: 742, change: "+12%" },
    { name: "Industry Beans Sydney", checkIns: 623, change: "+18%" },
  ],
  meetingPurposes: [
    { name: "Coffee Chat", value: 420, color: "#3B82F6" },
    { name: "Business Discussion", value: 285, color: "#10B981" },
    { name: "Networking", value: 178, color: "#F59E0B" },
    { name: "Collaboration", value: 142, color: "#8B5CF6" },
    { name: "Partnership", value: 98, color: "#EC4899" },
  ],
  mostActiveMembers: [
    { name: "Michael Chen", meetings: 24, connections: 18 },
    { name: "Sarah Williams", meetings: 21, connections: 22 },
    { name: "Emma Thompson", meetings: 18, connections: 16 },
    { name: "James Rodriguez", meetings: 15, connections: 12 },
    { name: "Sophie Martin", meetings: 14, connections: 19 },
  ],
};

export interface AdminAnalytics {
  overview: {
    totalMembers: number;
    activeThisWeek: number;
    checkInsToday: number;
    completedMeetings: number;
  };
  networking: {
    totalInvitations: number;
    acceptedMeetings: number;
    completedMeetings: number;
    attendanceRate: number;
  };
  weeklyCheckIns: Array<{ day: string; checkIns: number }>;
  topVenues: Array<{ name: string; checkIns: number; change: string }>;
  meetingPurposes: Array<{ name: string; value: number; color: string }>;
  mostActiveMembers: Array<{ name: string; meetings: number; connections: number }>;
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

function normalizePurpose(purpose: string) {
  if (purpose === "Partnership Opportunity") return "Partnership";
  return purpose;
}

export function deriveAdminAnalytics(
  checkIns: CheckInRecord[],
  invitations: InvitationRecord[]
): AdminAnalytics {
  const today = new Date();
  const venueCheckIns = checkIns.filter(
    (checkIn) => checkIn.source !== "networking_meeting"
  );
  const liveCheckInsToday = venueCheckIns.filter((checkIn) =>
    isSameLocalDay(new Date(checkIn.checkedInAt), today)
  ).length;
  const liveCompletedMeetings = invitations.filter(
    (invitation) => invitation.status === "completed"
  ).length;
  const liveAcceptedMeetings = invitations.filter(
    (invitation) =>
      invitation.status === "accepted" || invitation.status === "completed"
  ).length;

  const weeklyCheckIns = adminAnalyticsBaseline.weeklyCheckIns.map((entry) => ({
    ...entry,
    checkIns:
      entry.checkIns +
      venueCheckIns.filter(
        (checkIn) => getDayLabel(new Date(checkIn.checkedInAt)) === entry.day
      ).length,
  }));

  const topVenues = adminAnalyticsBaseline.topVenues
    .map((venue) => ({
      ...venue,
      checkIns:
        venue.checkIns +
        venueCheckIns.filter((checkIn) => checkIn.venueName === venue.name).length,
    }))
    .sort((venueA, venueB) => venueB.checkIns - venueA.checkIns);

  const meetingPurposes = adminAnalyticsBaseline.meetingPurposes.map((purpose) => ({
    ...purpose,
    value:
      purpose.value +
      invitations.filter(
        (invitation) => normalizePurpose(invitation.purpose) === purpose.name
      ).length,
  }));

  return {
    overview: {
      totalMembers: adminAnalyticsBaseline.totalMembers,
      activeThisWeek: adminAnalyticsBaseline.activeThisWeek,
      checkInsToday: adminAnalyticsBaseline.checkInsToday + liveCheckInsToday,
      completedMeetings: adminAnalyticsBaseline.completedMeetings + liveCompletedMeetings,
    },
    networking: {
      totalInvitations: adminAnalyticsBaseline.totalInvitations + invitations.length,
      acceptedMeetings: adminAnalyticsBaseline.acceptedMeetings + liveAcceptedMeetings,
      completedMeetings: adminAnalyticsBaseline.completedMeetings + liveCompletedMeetings,
      attendanceRate: adminAnalyticsBaseline.attendanceRate,
    },
    weeklyCheckIns,
    topVenues,
    meetingPurposes,
    mostActiveMembers: adminAnalyticsBaseline.mostActiveMembers,
  };
}
