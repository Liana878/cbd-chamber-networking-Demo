import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, MapPin, User, Users, MessageSquare, CheckCircle, XCircle, CalendarPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { InvitationRecord, InvitationStatus, useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";
import { getMemberByIdentity } from "../data/members";

const invitationsData = {
  1: {
    inviter: "Sarah Williams",
    invitee: "Michael Chen",
    inviteeCompany: "Chen & Associates Legal",
    venue: "The Grounds of the City",
    venueAddress: "500 George Street, Sydney CBD",
    date: "2026-05-15",
    time: "10:00 AM",
    purpose: "Coffee Chat",
    status: "Pending",
    direction: "sent",
    note: "Looking forward to discussing potential collaboration opportunities!",
    createdAt: "2026-05-10",
  },
  2: {
    inviter: "Emma Thompson",
    invitee: "Sarah Williams",
    inviteeCompany: "Harbour Strategy Studio",
    venue: "Single O Coffee",
    venueAddress: "60 Reservoir Street, Sydney CBD",
    date: "2026-05-12",
    time: "2:00 PM",
    purpose: "Business Discussion",
    status: "Accepted",
    direction: "received",
    note: "Would love to chat about sustainable architecture projects in the CBD.",
    createdAt: "2026-05-08",
  },
  3: {
    inviter: "Sarah Williams",
    invitee: "James Rodriguez",
    inviteeCompany: "Digital Growth Partners",
    venue: "The Royal Exchange Café",
    venueAddress: "56 Pitt Street, Sydney CBD",
    date: "2026-05-08",
    time: "9:00 AM",
    purpose: "Networking",
    status: "Completed",
    direction: "sent",
    note: "",
    createdAt: "2026-05-01",
  },
};

type InvitationDirection = "sent" | "received";

interface DisplayInvitationDetail {
  id: string;
  inviter: string;
  inviterCompany: string;
  invitee: string;
  inviteeCompany: string;
  venue: string;
  venueAddress: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
  direction: InvitationDirection;
  note: string;
  createdAt: string;
  senderIsCurrentUser: boolean;
  receiverIsCurrentUser: boolean;
  isLive: boolean;
}

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

function getIdentityDisplay(identity: string | undefined) {
  const member = getMemberByIdentity(identity);
  return {
    name: member?.name || "Chamber Member",
    company: member?.company || "Sydney CBD Chamber",
  };
}

function toLiveInvitationDetail(
  invitation: InvitationRecord,
  currentUserId: string
): DisplayInvitationDetail | null {
  const senderIsCurrentUser = invitation.senderId === currentUserId;
  const receiverIsCurrentUser = invitation.receiverId === currentUserId;

  if (!senderIsCurrentUser && !receiverIsCurrentUser) return null;

  const sender = getIdentityDisplay(invitation.senderId);
  const receiver = getIdentityDisplay(invitation.receiverId);

  return {
    id: invitation.id,
    inviter: sender.name,
    inviterCompany: sender.company,
    invitee: receiver.name,
    inviteeCompany: receiver.company,
    venue: invitation.venueName,
    venueAddress: "Sydney CBD",
    date: invitation.date,
    time: formatTime(invitation.time),
    purpose: invitation.purpose,
    status: getStatusLabel(invitation.status),
    direction: senderIsCurrentUser ? "sent" : "received",
    note: invitation.note,
    createdAt: invitation.createdAt,
    senderIsCurrentUser,
    receiverIsCurrentUser,
    isLive: true,
  };
}

function toSeedInvitationDetail(
  invitation: (typeof invitationsData)[keyof typeof invitationsData]
): DisplayInvitationDetail {
  return {
    id: invitation.createdAt,
    inviter: invitation.inviter,
    inviterCompany: "",
    invitee: invitation.invitee,
    inviteeCompany: invitation.inviteeCompany,
    venue: invitation.venue,
    venueAddress: invitation.venueAddress,
    date: invitation.date,
    time: invitation.time,
    purpose: invitation.purpose,
    status: invitation.status,
    direction: invitation.direction as InvitationDirection,
    note: invitation.note,
    createdAt: invitation.createdAt,
    senderIsCurrentUser: invitation.direction === "sent",
    receiverIsCurrentUser: invitation.direction === "received",
    isLive: false,
  };
}

export function InvitationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { invitations, updateInvitationStatus } = useAppState();
  const liveInvitation = invitations.find((item) => item.id === id);
  const seedInvitation = invitationsData[id as keyof typeof invitationsData];
  const invitation =
    currentUser && liveInvitation
      ? toLiveInvitationDetail(liveInvitation, currentUser.id)
      : seedInvitation
        ? toSeedInvitationDetail(seedInvitation)
        : null;
  const [showActions, setShowActions] = useState(true);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background p-6">
        <button
          onClick={() => navigate("/invitations", { replace: true })}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl mb-2">Invitation not found</h1>
        <p className="text-sm text-muted-foreground">
          This invitation is unavailable or you do not have access.
        </p>
      </div>
    );
  }

  const handleAccept = () => {
    if (invitation.isLive) {
      updateInvitationStatus(invitation.id, "accepted");
      return;
    }

    setShowActions(false);
    setTimeout(() => {
      navigate("/invitations");
    }, 1500);
  };

  const handleDecline = () => {
    if (invitation.isLive) {
      updateInvitationStatus(invitation.id, "declined");
      return;
    }

    setShowActions(false);
    setTimeout(() => {
      navigate("/invitations");
    }, 1500);
  };

  const handleCheckIn = () => {
    navigate(`/invitations/${id}/checkin`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white px-6 pt-12 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl mb-2">Invitation Details</h1>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-sm`}
          >
            {invitation.status}
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        {/* Participants Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-4"
        >
          <h2 className="text-sm text-muted-foreground mb-3">Participants</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm">
                  From: {invitation.inviter}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invitation.senderIsCurrentUser ? "You" : invitation.inviterCompany}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm">
                  To: {invitation.invitee}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invitation.receiverIsCurrentUser ? "You" : invitation.inviteeCompany}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meeting Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4"
        >
          <h2 className="text-sm text-muted-foreground mb-3">Meeting Details</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm mb-0.5">{invitation.venue}</p>
                <p className="text-xs text-muted-foreground">{invitation.venueAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <p className="text-sm">{new Date(invitation.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <p className="text-sm">{invitation.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <p className="text-sm">{invitation.purpose}</p>
            </div>
          </div>
        </motion.div>

        {/* Note Card */}
        {invitation.note && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm text-muted-foreground">Note</h2>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{invitation.note}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        {invitation.status === "Pending" && invitation.direction === "received" && showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-3 pt-4"
          >
            <button
              onClick={handleAccept}
              className="w-full bg-primary text-white py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Accept Invitation
            </button>
            <button
              onClick={handleDecline}
              className="w-full bg-card border border-border text-foreground py-4 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Decline
            </button>
          </motion.div>
        )}

        {invitation.status === "Accepted" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-3 pt-4"
          >
            <button
              onClick={handleCheckIn}
              className="w-full bg-primary text-white py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Check In to Meeting
            </button>
            <button className="w-full bg-card border border-border text-foreground py-4 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
              <CalendarPlus className="w-5 h-5" />
              Add to Calendar
            </button>
          </motion.div>
        )}

        {invitation.status === "Completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="pt-4"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-700">Meeting Completed</p>
              <p className="text-xs text-green-600 mt-1">+50 networking points earned</p>
            </div>
          </motion.div>
        )}

        {/* Metadata */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Invitation sent on {new Date(invitation.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
