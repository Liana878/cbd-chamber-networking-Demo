import { Link } from "react-router";
import { Search, Star, MapPin, Filter } from "lucide-react";
import { useState } from "react";

const venues = [
  {
    id: 1,
    name: "The Grounds of the City",
    category: "Café",
    rating: 4.8,
    reviewCount: 342,
    distance: "0.3 km",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
  },
  {
    id: 2,
    name: "Single O Coffee",
    category: "Café",
    rating: 4.9,
    reviewCount: 287,
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
  },
  {
    id: 3,
    name: "The Royal Exchange Café",
    category: "Café & Restaurant",
    rating: 4.7,
    reviewCount: 419,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400&q=80",
  },
  {
    id: 4,
    name: "Edition Coffee Roasters",
    category: "Café",
    rating: 4.6,
    reviewCount: 198,
    distance: "1.0 km",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  },
  {
    id: 5,
    name: "Industry Beans Sydney",
    category: "Café & Brunch",
    rating: 4.8,
    reviewCount: 256,
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  },
  {
    id: 6,
    name: "Workshop Espresso",
    category: "Café",
    rating: 4.5,
    reviewCount: 173,
    distance: "1.5 km",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&q=80",
  },
];

const categories = ["All", "Café", "Café & Restaurant", "Café & Brunch"];

export function VenueDirectory() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVenues = venues.filter((venue) => {
    const matchesCategory = selectedCategory === "All" || venue.category === selectedCategory;
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl mb-4">Venue Directory</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Venue List */}
      <div className="px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredVenues.length} venues found
        </p>

        <div className="space-y-3">
          {filteredVenues.map((venue) => (
            <Link key={venue.id} to={`/venues/${venue.id}`}>
              <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-3">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="truncate">{venue.name}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{venue.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{venue.category}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-md">
                        {venue.reviewCount} reviews
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{venue.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}