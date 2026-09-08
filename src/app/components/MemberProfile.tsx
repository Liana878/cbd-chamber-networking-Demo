import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Building2, Mail, Linkedin, MessageSquare, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { getMemberById } from "../data/members";
import { useAuth } from "../contexts/AuthContext";

export function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const member = getMemberById(id);
  const isCurrentUserProfile = member?.userId === currentUser?.id;

  if (!member) {
    return <div className="p-6">Member not found</div>;
  }

  if (!member.hasProfile || !member.expertise || !member.networkingStats) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-card border-b border-border px-6 pt-12 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl mb-2">{member.name}</h1>
          <p className="text-sm text-muted-foreground">
            Full profile details are coming soon.
          </p>
        </div>
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
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl mb-1">{member.name}</h1>
          <p className="text-sm opacity-90">{member.title}</p>
        </motion.div>
      </div>

      {/* Company Info */}
      <div className="px-6 -mt-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm">{member.company}</p>
              <p className="text-xs text-muted-foreground">{member.industry}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 mt-6">
        <h2 className="text-lg mb-3">About</h2>
        <p className="text-sm text-foreground/80 leading-relaxed">{member.bio}</p>
      </div>

      {/* Expertise */}
      <div className="px-6 mt-6">
        <h2 className="text-lg mb-3">Areas of Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {member.expertise.map((skill) => (
            <span
              key={skill}
              className="px-3 py-2 bg-primary/10 text-primary text-sm rounded-lg border border-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="text-2xl text-primary mb-1">{member.networkingStats.meetings}</div>
            <div className="text-xs text-muted-foreground">Networking Meetings</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="text-2xl text-primary mb-1">{member.networkingStats.connections}</div>
            <div className="text-xs text-muted-foreground">Chamber Connections</div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="px-6 mt-6">
        <h2 className="text-lg mb-3">Contact</h2>
        <div className="space-y-2">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm">{member.email}</span>
          </a>
          <a
            href={`https://${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors"
          >
            <Linkedin className="w-5 h-5 text-primary" />
            <span className="text-sm">{member.linkedin}</span>
          </a>
        </div>
      </div>

      {!isCurrentUserProfile && (
        <div className="px-6 mt-8 space-y-3">
            <button
              onClick={() => navigate(`/invitations/create/${id}`)}
              className="w-full bg-primary text-white py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Invite to Coffee Chat
            </button>
            <button
              onClick={() => navigate(`/invitations/create/${id}?type=meeting`)}
              className="w-full bg-card text-foreground border border-border py-4 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Invite to Business Meeting
            </button>
        </div>
      )}

      {/* Member Since */}
      <div className="px-6 mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Chamber Member since {member.memberSince}
        </p>
      </div>
    </div>
  );
}
