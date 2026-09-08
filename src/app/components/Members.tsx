import { Search, Building2, Briefcase, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { members } from "../data/members";
import { useAuth } from "../contexts/AuthContext";

const categories = ["All", "Industry", "Recent", "Most Active"];

export function Members() {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.industry.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === "All") return matchesSearch;
    if (activeCategory === "Most Active") return matchesSearch && member.active;
    return matchesSearch;
  });
  const displayedMembers = currentUser
    ? filteredMembers
        .slice()
        .sort((memberA, memberB) => {
          if (memberA.userId === currentUser.id) return -1;
          if (memberB.userId === currentUser.id) return 1;
          return 0;
        })
    : filteredMembers;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl mb-4">Members</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Members Count */}
      <div className="px-6 mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
        </p>
      </div>

      {/* Members List */}
      <div className="px-6 space-y-4">
        {displayedMembers.map((member, index) => {
          const isCurrentUserCard = member.userId === currentUser?.id;

          return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * index }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
          >
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {member.active && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="mb-0.5 truncate">{member.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{member.title}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate">{member.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{member.industry}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-2">
                {member.bio}
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-2">
                {isCurrentUserCard ? (
                  <Link to={`/members/${member.id}`} className="flex-1">
                    <button className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
                      My Profile
                    </button>
                  </Link>
                ) : (
                  <>
                    {member.hasProfile ? (
                      <Link to={`/members/${member.id}`} className="flex-1">
                        <button className="w-full bg-card border border-border text-foreground py-3 rounded-xl hover:bg-muted/50 transition-colors text-sm">
                          View Profile
                        </button>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 w-full bg-muted text-muted-foreground py-3 rounded-xl cursor-not-allowed text-sm"
                      >
                        Profile Soon
                      </button>
                    )}
                    {member.supportsInvitation ? (
                      <Link to={`/invitations/create/${member.id}`} className="flex-1">
                        <button className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          Invite
                        </button>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 w-full bg-muted text-muted-foreground py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        <Users className="w-4 h-4" />
                        Invite Soon
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg mb-1">No members found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
