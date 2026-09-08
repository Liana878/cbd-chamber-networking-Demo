import { Link } from "react-router";
import { MapPin, Navigation, Star } from "lucide-react";
import { useState } from "react";

const venues = [
  {
    id: 1,
    name: "The Grounds of the City",
    category: "Café",
    rating: 4.8,
    position: { top: "35%", left: "45%" },
  },
  {
    id: 2,
    name: "Single O Coffee",
    category: "Café",
    rating: 4.9,
    position: { top: "50%", left: "30%" },
  },
  {
    id: 3,
    name: "The Royal Exchange Café",
    category: "Café & Restaurant",
    rating: 4.7,
    position: { top: "40%", left: "65%" },
  },
  {
    id: 4,
    name: "Edition Coffee Roasters",
    category: "Café",
    rating: 4.6,
    position: { top: "60%", left: "50%" },
  },
  {
    id: 5,
    name: "Industry Beans Sydney",
    category: "Café & Brunch",
    rating: 4.8,
    position: { top: "25%", left: "55%" },
  },
  {
    id: 6,
    name: "Workshop Espresso",
    category: "Café",
    rating: 4.5,
    position: { top: "70%", left: "40%" },
  },
];

export function MapView() {
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-4">
        <h1 className="text-2xl mb-3">Nearby Venues</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm">
          <Navigation className="w-4 h-4" />
          Center on my location
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-180px)] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Streets - decorative lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/60"></div>
          <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/60"></div>
          <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white/60"></div>
          <div className="absolute top-0 bottom-0 left-2/3 w-0.5 bg-white/60"></div>
        </div>

        {/* Current Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Venue Markers */}
        {venues.map((venue) => (
          <button
            key={venue.id}
            onClick={() => setSelectedVenue(selectedVenue === venue.id ? null : venue.id)}
            className="absolute -translate-x-1/2 -translate-y-full z-20 transition-transform hover:scale-110"
            style={{ top: venue.position.top, left: venue.position.left }}
          >
            <MapPin
              className={`w-8 h-8 drop-shadow-lg ${
                selectedVenue === venue.id
                  ? "text-secondary fill-secondary"
                  : "text-primary fill-primary"
              }`}
            />
          </button>
        ))}

        {/* Selected Venue Info Card */}
        {selectedVenue !== null && (
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <Link to={`/venues/${selectedVenue}`}>
              <div className="bg-card rounded-2xl p-4 shadow-xl border border-border">
                {venues
                  .filter((v) => v.id === selectedVenue)
                  .map((venue) => (
                    <div key={venue.id}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="mb-1">{venue.name}</h3>
                          <p className="text-sm text-muted-foreground">{venue.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{venue.rating}</span>
                        </div>
                      </div>
                      <button className="w-full bg-primary text-white py-2 rounded-lg text-sm mt-3">
                        Get Directions
                      </button>
                    </div>
                  ))}
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-32 right-6 bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Your location</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary fill-primary" />
            <span>Member venues</span>
          </div>
        </div>
      </div>
    </div>
  );
}
