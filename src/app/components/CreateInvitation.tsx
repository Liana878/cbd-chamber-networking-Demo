import { useParams, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, MapPin, Calendar, Clock, MessageSquare, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { getMemberById, getMemberIdentity } from "../data/members";
import { useAuth } from "../contexts/AuthContext";
import { useAppState } from "../contexts/AppStateContext";

const venues = [
  { id: 1, name: "The Grounds of the City", address: "500 George Street" },
  { id: 2, name: "Single O Coffee", address: "60 Reservoir Street" },
  { id: 3, name: "The Royal Exchange Café", address: "56 Pitt Street" },
];

const purposes = [
  { id: "coffee", label: "Coffee Chat", icon: "☕" },
  { id: "networking", label: "Networking", icon: "🤝" },
  { id: "business", label: "Business Discussion", icon: "💼" },
  { id: "collaboration", label: "Collaboration", icon: "🔗" },
  { id: "partnership", label: "Partnership Opportunity", icon: "🚀" },
];

export function CreateInvitation() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createInvitation } = useAppState();
  const [searchParams] = useSearchParams();
  const invitationType = searchParams.get("type");

  const invitee = getMemberById(memberId);
  const isSelfInvitation = Boolean(
    currentUser && invitee?.userId && invitee.userId === currentUser.id
  );
  const canCreateInvitation = Boolean(invitee?.supportsInvitation && !isSelfInvitation);

  const [selectedVenue, setSelectedVenue] = useState(venues[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState(
    invitationType === "meeting" ? "business" : "coffee"
  );
  const [note, setNote] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleSendInvitation = () => {
    if (!canCreateInvitation) return;

    const venue = venues.find((item) => item.id === selectedVenue);
    const purpose = purposes.find((item) => item.id === selectedPurpose);

    if (!invitee || !venue || !purpose) return;

    const invitation = createInvitation({
      receiverId: getMemberIdentity(invitee),
      venueId: venue.id,
      venueName: venue.name,
      date: selectedDate,
      time: selectedTime,
      purpose: purpose.label,
      note,
      reminder: reminderEnabled,
    });

    if (invitation) {
      navigate("/invitations", { state: { invitationSent: true } });
    }
  };

  if (!invitee || !invitee.supportsInvitation) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-card border-b border-border px-6 pt-12 pb-6">
          <button
            onClick={() => navigate("/members", { replace: true })}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl mb-2">Invitation unavailable</h1>
          <p className="text-sm text-muted-foreground">
            This member is not available for invitations yet.
          </p>
        </div>
      </div>
    );
  }

  if (isSelfInvitation) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-card border-b border-border px-6 pt-12 pb-6">
          <button
            onClick={() => navigate("/members", { replace: true })}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl mb-2">You cannot invite yourself</h1>
          <p className="text-sm text-muted-foreground">
            Choose another chamber member to start a networking invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl">Create Invitation</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Invite {invitee.name} to connect at a Chamber partner venue
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Invitee Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <label className="text-sm text-muted-foreground mb-2 block">Inviting</label>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-4">
            <h3 className="mb-1">{invitee.name}</h3>
            <p className="text-sm text-muted-foreground">{invitee.company}</p>
          </div>
        </motion.div>

        {/* Current User */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label className="text-sm text-muted-foreground mb-2 block">From (View as)</label>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm">{currentUser?.name || "Member"}</p>
          </div>
        </motion.div>

        {/* Venue Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Select Venue
          </label>
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(Number(e.target.value))}
            className="w-full p-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} - {venue.address}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </motion.div>

        {/* Meeting Purpose */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="text-sm text-muted-foreground mb-3 block">Meeting Purpose</label>
          <div className="grid grid-cols-2 gap-2">
            {purposes.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => setSelectedPurpose(purpose.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPurpose === purpose.id
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-border hover:bg-muted/50"
                }`}
              >
                <div className="text-lg mb-1">{purpose.icon}</div>
                <div className="text-xs">{purpose.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Optional Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Optional Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            rows={3}
            className="w-full p-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </motion.div>

        {/* Reminder Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm">Send Reminder</p>
              <p className="text-xs text-muted-foreground">
                Notify both parties 1 day before
              </p>
            </div>
          </div>
          <button
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${
              reminderEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                reminderEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </motion.div>

        {/* Send Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          onClick={handleSendInvitation}
          disabled={!selectedDate || !selectedTime}
          className={`w-full py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 ${
            selectedDate && selectedTime
              ? "bg-primary text-white hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Send Invitation
        </motion.button>
      </div>
    </div>
  );
}
