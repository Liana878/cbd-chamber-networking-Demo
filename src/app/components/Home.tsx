import { Link, useNavigate } from "react-router";
import { ChevronRight, Star, MapPin, Clock, Users, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";

const featuredVenues = [
  {
    id: 1,
    name: "The Grounds of the City",
    category: "Chamber Partner Venue",
    rating: 4.8,
    reviewCount: 342,
    distance: "0.3 km",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
  },
  {
    id: 2,
    name: "Single O Coffee",
    category: "Chamber Partner Venue",
    rating: 4.9,
    reviewCount: 287,
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
  },
  {
    id: 3,
    name: "The Royal Exchange Café",
    category: "Chamber Partner Venue",
    rating: 4.7,
    reviewCount: 419,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=80",
  },
];

export function Home() {
  const { totalPoints, venueVisits } = useAppState();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const quickStats = [
    { label: "Venue Visits", value: venueVisits.toLocaleString() },
    { label: "Member Catch-ups", value: "8" },
    { label: "Total Points", value: totalPoints.toLocaleString() },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white px-6 pt-12 pb-8 rounded-b-[2rem] relative">
        <button
          onClick={handleLogout}
          className="absolute top-3 right-4 bg-white/10 backdrop-blur-sm text-white/90 border border-white/20 rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-sm hover:bg-white/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm opacity-90 mb-1">Good afternoon,</p>
          <h1 className="text-3xl mb-6">{currentUser?.name || "Member"}</h1>

          <div className="grid grid-cols-3 gap-3">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
              >
                <div className="text-xl mb-1">{stat.value}</div>
                <div className="text-xs opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Featured Venues */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Featured Venues</h2>
          <Link to="/venues" className="text-sm text-primary flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {featuredVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link to={`/venues/${venue.id}`}>
                <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-40">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{venue.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">{venue.category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{venue.distance}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-muted-foreground">
                      <span className="text-xs">{venue.reviewCount} Google reviews</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8 mb-6">
        <h2 className="text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/checkin">
            <div className="bg-primary text-white rounded-xl p-4 text-center hover:opacity-90 transition-opacity">
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Check In</p>
            </div>
          </Link>
          <Link to="/members">
            <div className="bg-secondary text-white rounded-xl p-4 text-center hover:opacity-90 transition-opacity">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Browse Members</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
