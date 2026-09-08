import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Star, MapPin, Phone, Clock, Share2, Heart, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

const venueData = {
  1: {
    name: "The Grounds of the City",
    category: "Chamber Partner Venue",
    rating: 4.8,
    reviews: 342,
    distance: "0.3 km",
    address: "500 George Street, Sydney CBD",
    phone: "(02) 9262 3060",
    hours: "Mon-Fri: 6:30am-5pm, Sat-Sun: 7am-4pm",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    description: "Popular CBD café known for exceptional specialty coffee and quality breakfast & lunch options. Spacious setting with a welcoming atmosphere ideal for informal business meetings and networking over coffee.",
    amenities: ["WiFi", "Outdoor Seating", "Specialty Coffee", "Full Menu"],
  },
  2: {
    name: "Single O Coffee",
    category: "Chamber Partner Venue",
    rating: 4.9,
    reviews: 287,
    distance: "0.5 km",
    address: "60 Reservoir Street, Sydney CBD",
    phone: "(02) 8263 7071",
    hours: "Mon-Fri: 7am-4pm, Sat-Sun: 8am-3pm",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    description: "Renowned specialty coffee roaster with a sleek café space perfect for professional catch-ups. Award-winning coffee and light food menu make this a favorite spot for Chamber members to connect.",
    amenities: ["WiFi", "Coffee Roastery", "Seating Area", "Takeaway"],
  },
  3: {
    name: "The Royal Exchange Café",
    category: "Chamber Partner Venue",
    rating: 4.7,
    reviews: 419,
    distance: "0.8 km",
    address: "56 Pitt Street, Sydney CBD",
    phone: "(02) 9247 3936",
    hours: "Mon-Fri: 7am-6pm, Sat: 8am-4pm",
    image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=80",
    description: "Classic CBD café with a sophisticated vibe, offering premium coffee and all-day dining. Comfortable seating areas and professional atmosphere make it an excellent venue for business discussions.",
    amenities: ["WiFi", "All-day Menu", "Private Tables", "Conference Friendly"],
  },
};

export function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const venue = venueData[id as keyof typeof venueData];

  if (!venue) {
    return <div className="p-6">Venue not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-64">
        <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl mb-1">{venue.name}</h1>
                <p className="text-muted-foreground">{venue.category}</p>
              </div>
              <div className="flex items-center gap-1 bg-accent/50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{venue.rating}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              {venue.reviews} Google reviews
            </p>

            <p className="text-sm text-foreground/80 leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Google Review CTA */}
          <div className="mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <div className="flex items-start gap-3 mb-3">
                <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="mb-1">Support Our Partners</h3>
                  <p className="text-xs text-muted-foreground">
                    Enjoyed your visit? Leave a Google review to support this Chamber partner venue.
                  </p>
                </div>
              </div>
              <button className="w-full bg-white text-primary py-3 rounded-lg hover:bg-white/90 transition-colors border border-primary/30 flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Write a Google Review
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm">{venue.address}</p>
                <p className="text-xs text-muted-foreground">{venue.distance} away</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm">{venue.phone}</p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm">{venue.hours}</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-xl mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-2 bg-muted text-sm rounded-lg"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-primary text-white py-4 rounded-xl hover:opacity-90 transition-opacity">
            Get Directions
          </button>
        </motion.div>
      </div>
    </div>
  );
}