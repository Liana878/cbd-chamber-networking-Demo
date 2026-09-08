import { Link, useLocation, useNavigate } from "react-router";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InvitationRecord, InvitationStatus, useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";
import { getMemberByIdentity } from "../data/members";

const SARAH_USER_ID = "member-001";
const filters = ["All", "Sent", "Received", "Pending", "Accepted", "Completed"];

interface SeedInvitationRecord extends InvitationRecord {
  detailId: number;
}

interface DisplayInvitation extends InvitationRecord {
  direction: "sent" | "received";
  counterpartyName: string;
  counterpartyCompany: string;
  detailPath?: string;
  isLive: boolean;
}

const sarahHistoricalInvitations: SeedInvitationRecord[] = [
  {
    id: "seed-1",
    detailId: 1,
    senderId: "member-001",
    receiverId: "member-002",
    venueId: 1,
    venueName: "The Grounds of the City",
    date: "2026-05-15",
    time: "10:00",
    purpose: "Coffee Chat",
    status: "pending",
    note: "Looking forward to discussing potential collaboration opportunities!",
    reminder: true,
    createdAt: "2026-05-10T00:00:00.000Z",
  },
  {
    id: "seed-2",
    detailId: 2,
    senderId: "member-003",
    receiverId: "member-001",
    venueId: 2,
    venueName: "Single O Coffee",
    date: "2026-05-12",
    time: "14:00",
    purpose: "Business Discussion",
    status: "accepted",
    note: "Would love to chat about sustainable architecture projects in the CBD.",
    reminder: true,
    createdAt: "2026-05-08T00:00:00.000Z",
  },
  {
    id: "seed-3",
    detailId: 3,
    senderId: "member-001",
    receiverId: "directory-member-3",
    venueId: 3,
    venueName: "The Royal Exchange Café",
    date: "2026-05-08",
    time: "09:00",
    purpose: "Networking",
    status: "completed",
    note: "",
    reminder: false,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "seed-4",
    detailId: 4,
    senderId: "directory-member-5",
    receiverId: "member-001",
    venueId: 1,
    venueName: "The Grounds of the City",
    date: "2026-05-10",
    time: "11:30",
    purpose: "Collaboration",
    status: "pending",
    note: "",
    reminder: true,
    createdAt: "2026-05-06T00:00:00.000Z",
  },
  {
    id: "seed-5",
    detailId: 5,
    senderId: "member-001",
    receiverId: "directory-member-4",
    venueId: 2,
    venueName: "Single O Coffee",
    date: "2026-05-05",
    time: "15:00",
    purpose: "Partnership Opportunity",
    status: "completed",
    note: "",
    reminder: false,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "seed-6",
    detailId: 6,
    senderId: "directory-member-6",
    receiverId: "member-001",
    venueId: 3,
    venueName: "The Royal Exchange Café",
    date: "2026-05-14",
    time: "13:00",
    purpose: "Coffee Chat",
    status: "pending",
    note: "",
    reminder: true,
    createdAt: "2026-05-09T00:00:00.000Z",
  },
];

function getStatusLabel(status: InvitationStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatTime(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  return new Date(2026, 0, 1, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getIdentityDisplay(identity: string) {
  const member = getMemberByIdentity(identity);
  return {
    name: member?.name || "Chamber Member",
    company: member?.company || "Sydney CBD Chamber",
  };
}

const getStatusIcon = (status: InvitationStatus) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "accepted":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "declined":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: InvitationStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "accepted":
      return "bg-green-50 text-green-700 border-green-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "declined":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-muted text-foreground border-border";
  }
};

export function NetworkingList() {
  const { currentUser } = useAuth();
  const { invitations, updateInvitationStatus } = useAppState();
  const [activeFilter, setActiveFilter] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();
  const showSuccessMessage = location.state?.invitationSent;

  const visibleInvitations = useMemo(() => {
    if (!currentUser) return [];

    const liveInvitations = invitations.filter(
      (invitation) =>
        invitation.senderId === currentUser.id || invitation.receiverId === currentUser.id
    );
    const seedInvitations =
      currentUser.id === SARAH_USER_ID ? sarahHistoricalInvitations : [];

    return [...liveInvitations, ...seedInvitations]
      .map<DisplayInvitation>((invitation) => {
        const direction =
          invitation.senderId === currentUser.id ? "sent" : "received";
        const counterparty = getIdentityDisplay(
          direction === "sent" ? invitation.receiverId : invitation.senderId
        );
        const isSeedInvitation = "detailId" in invitation;
        const detailPath = isSeedInvitation
          ? invitation.detailId <= 3
            ? `/invitations/${invitation.detailId}`
            : undefined
          : `/invitations/${invitation.id}`;

        return {
          ...invitation,
          direction,
          counterpartyName: counterparty.name,
          counterpartyCompany: counterparty.company,
          detailPath,
          isLive: !isSeedInvitation,
        };
      })
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [currentUser, invitations]);

  const filteredInvitations = visibleInvitations.filter((invitation) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Sent") return invitation.direction === "sent";
    if (activeFilter === "Received") return invitation.direction === "received";
    return getStatusLabel(invitation.status) === activeFilter;
  });

  const filterTabs = filters.map((filter) => {
    const count =
      filter === "All"
        ? visibleInvitations.length
        : filter === "Sent"
          ? visibleInvitations.filter((invitation) => invitation.direction === "sent").length
          : filter === "Received"
            ? visibleInvitations.filter((invitation) => invitation.direction === "received")
                .length
            : visibleInvitations.filter(
                (invitation) => getStatusLabel(invitation.status) === filter
              ).length;

    return { label: filter, count };
  });

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white px-6 pt-12 pb-6">
        <h1 className="text-2xl mb-2">My Network</h1>
        <p className="text-sm opacity-90 mb-4">
          Your personal networking hub for chamber connections
        </p>
        <Link
          to="/members"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary rounded-xl hover:bg-white/90 transition-colors shadow-lg"
        >
          <Users className="w-5 h-5" />
          <span>Browse Members to Invite</span>
        </Link>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">Invitation sent successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Chips */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {filterTabs.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeFilter === filter.label
                  ? "bg-primary text-white"
                  : "bg-card border border-border text-foreground hover:bg-muted/50"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Invitations List */}
      <div className="px-6 space-y-3">
        {filteredInvitations.map((invitation, index) => (
          <motion.div
            key={invitation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * index }}
          >
            <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div
                onClick={() => {
                  if (invitation.detailPath) navigate(invitation.detailPath);
                }}
                onKeyDown={(event) => {
                  if (
                    invitation.detailPath &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    navigate(invitation.detailPath);
                  }
                }}
                role={invitation.detailPath ? "link" : undefined}
                tabIndex={invitation.detailPath ? 0 : undefined}
                className={invitation.detailPath ? "cursor-pointer" : ""}
              >
                <div className="p-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                        invitation.status
                      )}`}
                    >
                      {getStatusIcon(invitation.status)}
                      {getStatusLabel(invitation.status)}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        invitation.direction === "sent"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {invitation.direction === "sent" ? "Sent" : "Received"}
                    </span>
                  </div>

                  {/* Participants */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">
                          {invitation.direction === "sent" ? "To: " : "From: "}
                        </span>
                        {invitation.counterpartyName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      {invitation.counterpartyCompany}
                    </p>
                  </div>

                  {/* Meeting Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{invitation.venueName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(invitation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{formatTime(invitation.time)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">{invitation.purpose}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Pending Received Invitations */}
              {invitation.status === "pending" && invitation.direction === "received" && (
                <div className="px-4 pb-4">
                  <div className="pt-3 border-t border-border flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (invitation.isLive) {
                          updateInvitationStatus(invitation.id, "accepted");
                          return;
                        }

                        if (invitation.detailPath) navigate(invitation.detailPath);
                      }}
                      className="flex-1 w-full bg-primary text-white py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (invitation.detailPath) navigate(invitation.detailPath);
                      }}
                      className="flex-1 w-full bg-muted text-foreground py-2 rounded-lg text-sm hover:bg-muted/80 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInvitations.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg mb-1">
            {activeFilter === "All"
              ? "No networking invitations yet"
              : `No ${activeFilter.toLowerCase()} invitations`}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {activeFilter === "All"
              ? "Start connecting with chamber members"
              : "Try adjusting your filters or create a new invitation"}
          </p>
          <Link
            to="/members"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Users className="w-4 h-4" />
            Browse Members to Invite
          </Link>
        </div>
      )}
    </div>
  );
}
