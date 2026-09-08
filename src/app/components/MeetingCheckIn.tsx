import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Users, Calendar, CheckCircle, MessageSquare } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";
import { getMemberByIdentity } from "../data/members";

function formatTime(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  return new Date(2026, 0, 1, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getIdentityName(identity: string | undefined) {
  return getMemberByIdentity(identity)?.name || "Chamber Member";
}

export function MeetingCheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addCheckIn, completeInvitationMeeting, invitations } = useAppState();
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [venueCheckIn, setVenueCheckIn] = useState(false);
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [meetingOutcome, setMeetingOutcome] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const checkInRecordedRef = useRef(false);
  const liveInvitation = invitations.find((invitation) => invitation.id === id);
  const isLiveInvitation = Boolean(liveInvitation);
  const isLegacySeedMeeting = !liveInvitation && id === "2";
  const isParticipant =
    liveInvitation &&
    currentUser &&
    (liveInvitation.senderId === currentUser.id || liveInvitation.receiverId === currentUser.id);

  const legacyMeeting = {
    inviter: "Sarah Williams",
    invitee: "Michael Chen",
    venueId: 1,
    venue: "The Grounds of the City",
    date: "2026-05-15",
    time: "10:00 AM",
    purpose: "Coffee Chat",
  };

  const meeting =
    liveInvitation && isParticipant
      ? {
          inviter: getIdentityName(liveInvitation.senderId),
          invitee: getIdentityName(liveInvitation.receiverId),
          venueId: liveInvitation.venueId,
          venue: liveInvitation.venueName,
          date: liveInvitation.date,
          time: formatTime(liveInvitation.time),
          purpose: liveInvitation.purpose,
        }
      : isLegacySeedMeeting
        ? legacyMeeting
        : null;

  const outcomes = [
    { id: "productive", label: "Very Productive", emoji: "🎯" },
    { id: "good", label: "Good Connection", emoji: "🤝" },
    { id: "followup", label: "Needs Follow-up", emoji: "📅" },
    { id: "exploratory", label: "Exploratory", emoji: "🔍" },
  ];

  const handleComplete = () => {
    if (checkInRecordedRef.current || !canComplete) return;
    checkInRecordedRef.current = true;

    if (liveInvitation) {
      const completedInvitation = completeInvitationMeeting(liveInvitation.id, {
        confirmAttendance: attendanceConfirmed,
        meetingOutcome,
        followUpNotes: outcomeNotes,
      });

      if (!completedInvitation) {
        checkInRecordedRef.current = false;
        setCompletionError("This meeting cannot be completed from the current state.");
        return;
      }
    } else {
      if (!meeting) return;
      addCheckIn({
        venueId: meeting.venueId,
        venueName: meeting.venue,
        source: "meeting_checkin",
      });
    }

    setShowSuccess(true);
    setTimeout(() => {
      navigate(liveInvitation ? `/invitations/${liveInvitation.id}` : "/invitations");
    }, 2000);
  };

  const canComplete = attendanceConfirmed;

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background p-6">
        <button
          onClick={() => navigate("/invitations", { replace: true })}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl mb-2">Meeting unavailable</h1>
        <p className="text-sm text-muted-foreground">
          This meeting is unavailable or you do not have access.
        </p>
      </div>
    );
  }

  if (liveInvitation && !isParticipant) {
    return (
      <div className="min-h-screen bg-background p-6">
        <button
          onClick={() => navigate("/invitations", { replace: true })}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl mb-2">Meeting unavailable</h1>
        <p className="text-sm text-muted-foreground">
          This meeting is unavailable or you do not have access.
        </p>
      </div>
    );
  }

  if (liveInvitation && liveInvitation.status === "completed") {
    return (
      <div className="min-h-screen bg-background p-6">
        <button
          onClick={() => navigate(`/invitations/${liveInvitation.id}`, { replace: true })}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <h1 className="text-xl mb-1">Meeting Completed</h1>
          <p className="text-xs text-green-600">+50 networking points earned</p>
        </div>
      </div>
    );
  }

  if (isLiveInvitation && liveInvitation?.status !== "accepted") {
    return (
      <div className="min-h-screen bg-background p-6">
        <button
          onClick={() => navigate(`/invitations/${liveInvitation?.id || ""}`, { replace: true })}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl mb-2">Meeting not ready</h1>
        <p className="text-sm text-muted-foreground">
          This invitation must be accepted before meeting check-in.
        </p>
      </div>
    );
  }

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
          <h1 className="text-2xl mb-2">Meeting Check-In</h1>
          <p className="text-sm opacity-90">Confirm and record meeting details</p>
        </motion.div>
      </div>

      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-6 py-12 text-center"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Meeting Completed!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Networking activity recorded successfully
            </p>
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <div className="text-3xl text-green-600 mb-1">+50 pts</div>
              <div className="text-xs text-muted-foreground">
                Awarded to both participants
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="px-6 -mt-4 space-y-4">
          {/* Meeting Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <h2 className="text-sm text-muted-foreground mb-3">Meeting Summary</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {meeting.inviter} & {meeting.invitee}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{meeting.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Attendance Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm mb-1">Confirm Attendance</h3>
                <p className="text-xs text-muted-foreground">Both parties attended the meeting</p>
              </div>
              <button
                onClick={() => setAttendanceConfirmed(!attendanceConfirmed)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  attendanceConfirmed ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    attendanceConfirmed ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Venue Check-In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm mb-1">Venue Check-In</h3>
                <p className="text-xs text-muted-foreground">
                  Confirm meeting at Chamber partner venue
                </p>
              </div>
              <button
                onClick={() => setVenueCheckIn(!venueCheckIn)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  venueCheckIn ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    venueCheckIn ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Meeting Outcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <h3 className="text-sm text-muted-foreground mb-3">Meeting Outcome</h3>
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((outcome) => (
                <button
                  key={outcome.id}
                  onClick={() => setMeetingOutcome(outcome.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    meetingOutcome === outcome.id
                      ? "bg-primary text-white border-primary"
                      : "bg-background border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="text-lg mb-1">{outcome.emoji}</div>
                  <div className="text-xs">{outcome.label}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Outcome Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h3 className="text-sm text-muted-foreground">Follow-up Notes (Optional)</h3>
            </div>
            <textarea
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="Add notes about key takeaways, action items, or next steps..."
              rows={4}
              className="w-full p-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </motion.div>

          {/* Points Preview */}
          {canComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-4 text-center"
            >
              <p className="text-sm text-muted-foreground mb-1">You'll earn</p>
              <div className="text-2xl text-primary">+50 pts</div>
              <p className="text-xs text-muted-foreground mt-1">
                Networking Points for both participants
              </p>
            </motion.div>
          )}

          {/* Complete Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            onClick={handleComplete}
            disabled={!canComplete || checkInRecordedRef.current}
            className={`w-full py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 ${
              canComplete
                ? "bg-primary text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Completed
          </motion.button>

          {!canComplete && (
            <p className="text-xs text-center text-muted-foreground">
              Please confirm both parties attended before marking complete
            </p>
          )}

          {completionError && (
            <p className="text-xs text-center text-destructive">{completionError}</p>
          )}
        </div>
      )}
    </div>
  );
}
