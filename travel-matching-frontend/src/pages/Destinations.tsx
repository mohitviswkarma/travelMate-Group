import { useNavigate } from "react-router-dom"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  MapPin, 
  Compass, 
  Search,
  Calendar,
  Users,
  Flame,
  Heart,
  Share2,
  Check,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Destination {
  id: string
  name: string
  country: string
  region: string
  image: string
  description: string
  highlights: string[]
  temperature: string
  bestMonth: string
  travelers: number
  popularity: number
  rating: number
  budget: string
  vibes: string[]
}

const DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Paris",
    country: "France",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80",
    description: "The City of Light awaits with romance, culture, and world-class cuisine around every corner.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine River", "Montmartre"],
    temperature: "8-15°C",
    bestMonth: "April-June",
    travelers: 1240,
    popularity: 98,
    rating: 4.8,
    budget: "$200-300/day",
    vibes: ["Romantic", "Cultural", "Foodie"]
  },
  {
    id: "2",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&q=80",
    description: "Experience the perfect blend of ancient temples and cutting-edge technology in this vibrant metropolis.",
    highlights: ["Senso-ji Temple", "Shibuya Crossing", "Mount Fuji", "Tsukiji Market"],
    temperature: "10-25°C",
    bestMonth: "March-May, Sept-Nov",
    travelers: 856,
    popularity: 96,
    rating: 4.7,
    budget: "$150-250/day",
    vibes: ["Tech-Savvy", "Cultural", "Adventurous"]
  },
  {
    id: "3",
    name: "Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop&q=80",
    description: "Tropical paradise with pristine beaches, ancient temples, and legendary hospitality.",
    highlights: ["Ubud Temples", "Rice Terraces", "Kuta Beach", "Mount Batur Sunrise"],
    temperature: "24-28°C",
    bestMonth: "April-October",
    travelers: 2103,
    popularity: 94,
    rating: 4.6,
    budget: "$50-150/day",
    vibes: ["Relaxing", "Spiritual", "Beach Lover"]
  },
  {
    id: "4",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=600&fit=crop&q=80",
    description: "Gaudí's masterpieces, vibrant nightlife, and Mediterranean beaches define this creative city.",
    highlights: ["Sagrada Familia", "Park Güell", "Gothic Quarter", "La Rambla"],
    temperature: "10-25°C",
    bestMonth: "May-June, Sept-Oct",
    travelers: 1567,
    popularity: 95,
    rating: 4.7,
    budget: "$150-250/day",
    vibes: ["Artistic", "Social", "Beach Lover"]
  },
  {
    id: "5",
    name: "New York City",
    country: "USA",
    region: "North America",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80",
    description: "The city that never sleeps offers endless entertainment, dining, and iconic landmarks.",
    highlights: ["Statue of Liberty", "Central Park", "Times Square", "Broadway"],
    temperature: "0-20°C",
    bestMonth: "May-June, Sept-Oct",
    travelers: 1893,
    popularity: 97,
    rating: 4.6,
    budget: "$250-400/day",
    vibes: ["Urban", "Foodie", "Nightlife"]
  },
  {
    id: "6",
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop&q=80",
    description: "Luxury and innovation merge in this desert oasis with world-class shopping and dining.",
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari"],
    temperature: "25-35°C",
    bestMonth: "October-April",
    travelers: 945,
    popularity: 92,
    rating: 4.5,
    budget: "$300-500/day",
    vibes: ["Luxury", "Modern", "Shopping"]
  },
  {
    id: "7",
    name: "Bangkok",
    country: "Thailand",
    region: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop&q=80",
    description: "Bustling street markets, ornate temples, and incredible street food create unforgettable memories.",
    highlights: ["Grand Palace", "Wat Pho", "Floating Markets", "Muay Thai"],
    temperature: "24-32°C",
    bestMonth: "November-February",
    travelers: 1724,
    popularity: 93,
    rating: 4.5,
    budget: "$60-120/day",
    vibes: ["Cultural", "Foodie", "Budget-Friendly"]
  },
  {
    id: "8",
    name: "Machu Picchu",
    country: "Peru",
    region: "South America",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop&q=80",
    description: "Ancient Incan city high in the Andes offers breathtaking views and historical wonders.",
    highlights: ["Incan Ruins", "Mountain Views", "Sacred Valley", "Cusco"],
    temperature: "8-18°C",
    bestMonth: "May-September",
    travelers: 687,
    popularity: 91,
    rating: 4.8,
    budget: "$80-150/day",
    vibes: ["Historical", "Adventurous", "Nature Lover"]
  },
  {
    id: "9",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop&q=80",
    description: "Iconic white-washed buildings and stunning sunsets make this Greek island unforgettable.",
    highlights: ["Oia Sunset", "Blue Domes", "Wine Tasting", "Red Beach"],
    temperature: "18-28°C",
    bestMonth: "April-October",
    travelers: 1456,
    popularity: 96,
    rating: 4.9,
    budget: "$180-280/day",
    vibes: ["Romantic", "Relaxing", "Beach Lover"]
  },
  {
    id: "10",
    name: "Iceland",
    country: "Iceland",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop&q=80",
    description: "Land of fire and ice with geysers, waterfalls, and the magical Northern Lights.",
    highlights: ["Blue Lagoon", "Northern Lights", "Geysers", "Waterfalls"],
    temperature: "-5-15°C",
    bestMonth: "June-August",
    travelers: 823,
    popularity: 89,
    rating: 4.7,
    budget: "$200-350/day",
    vibes: ["Adventurous", "Nature Lover", "Unique"]
  },
  {
    id: "11",
    name: "Maldives",
    country: "Maldives",
    region: "South Asia",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop&q=80",
    description: "Crystal-clear waters and overwater bungalows create the ultimate tropical paradise.",
    highlights: ["Overwater Villas", "Coral Reefs", "Beach Resorts", "Diving"],
    temperature: "26-30°C",
    bestMonth: "November-April",
    travelers: 1234,
    popularity: 95,
    rating: 4.8,
    budget: "$400-800/day",
    vibes: ["Luxury", "Relaxing", "Beach Lover"]
  },
  {
    id: "12",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop&q=80",
    description: "Ancient history meets modern Italian culture in the Eternal City.",
    highlights: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum"],
    temperature: "8-28°C",
    bestMonth: "April-June, Sept-Oct",
    travelers: 1678,
    popularity: 97,
    rating: 4.7,
    budget: "$150-250/day",
    vibes: ["Historical", "Cultural", "Foodie"]
  }
]

export default function DestinationsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [plannedTrips, setPlannedTrips] = useState<string[]>([])
  const [showShareToast, setShowShareToast] = useState(false)
  const [sharedDestination, setSharedDestination] = useState<string>("")

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter(dest => {
      const matchesSearch = 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesVibe = !selectedVibe || dest.vibes.includes(selectedVibe)
      
      return matchesSearch && matchesVibe
    })
  }, [searchQuery, selectedVibe])

  const allVibes = Array.from(
    new Set(DESTINATIONS.flatMap(d => d.vibes))
  ).sort()

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const handlePlanTrip = (destinationId: string, destinationName: string) => {
    setPlannedTrips(prev => 
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    )
    
    // Show a brief notification
    if (!plannedTrips.includes(destinationId)) {
      console.log(`Trip to ${destinationName} added to your planner!`)
    }
  }

  const handleShare = async (destination: Destination) => {
    const shareData = {
      title: `${destination.name}, ${destination.country}`,
      text: `Check out ${destination.name}! ${destination.description}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )
        setSharedDestination(destination.name)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 3000)
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 font-body selection:bg-primary selection:text-white pb-24">
      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <Card className="rounded-2xl border-none bg-white shadow-2xl shadow-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Link Copied!</p>
                <p className="text-xs text-slate-500">{sharedDestination} shared to clipboard</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/home")}
              className="rounded-2xl hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 text-slate-400 hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary via-primary to-blue-600 p-2.5 rounded-2xl shadow-xl shadow-primary/30 ring-4 ring-primary/10">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-black tracking-tight text-slate-900 uppercase bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Destinations
              </h1>
            </div>
          </div>
          
          {/* Favorites Counter */}
          {favoriteIds.length > 0 && (
            <Badge className="bg-gradient-to-br from-red-500 to-pink-600 text-white font-black rounded-xl border-none shadow-lg shadow-red-500/30 px-3 py-1.5">
              <Heart className="h-3 w-3 mr-1 fill-white" /> {favoriteIds.length}
            </Badge>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-10">
        {/* Title Section */}
        <div className="mb-10 space-y-3">
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent underline decoration-accent/40 decoration-[6px] underline-offset-[12px]">
              Destinations
            </span>
          </h2>
          <p className="text-slate-500 font-semibold text-lg">
            Discover amazing places and find travel companions heading the same way.
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 overflow-hidden relative group mb-12 hover:shadow-3xl hover:shadow-primary/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 via-purple-500/5 to-transparent rounded-full -ml-48 -mb-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          
          <CardContent className="p-10 md:p-12 relative z-10 space-y-8">
            {/* Search Input */}
            <div className="relative group/search">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-primary transition-colors duration-300" />
              <Input 
                placeholder="Search destinations, countries, or highlights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 rounded-3xl border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white font-medium text-base shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </Button>
              )}
            </div>

            {/* Vibe Filters */}
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Filter by vibe
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setSelectedVibe(null)}
                  variant={selectedVibe === null ? "default" : "outline"}
                  className={cn(
                    "rounded-full h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl",
                    selectedVibe === null 
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/30 scale-105 ring-4 ring-primary/20" 
                      : "border-2 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:scale-105 active:scale-95"
                  )}
                >
                  All Destinations
                </Button>
                {allVibes.map(vibe => (
                  <Button 
                    key={vibe}
                    onClick={() => setSelectedVibe(vibe === selectedVibe ? null : vibe)}
                    variant={selectedVibe === vibe ? "default" : "outline"}
                    className={cn(
                      "rounded-full h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl",
                      selectedVibe === vibe 
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/30 scale-105 ring-4 ring-primary/20" 
                        : "border-2 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:scale-105 active:scale-95"
                    )}
                  >
                    {vibe}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            {searchQuery || selectedVibe ? (
              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                <p className="text-sm font-bold text-slate-600">
                  <span className="text-primary text-lg font-black">{filteredDestinations.length}</span> destinations found
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedVibe(null)
                  }}
                  variant="ghost"
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                >
                  Clear All
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDestinations.map(destination => (
              <Card 
                key={destination.id}
                className="group rounded-[3rem] border-2 border-slate-100/50 bg-white shadow-xl shadow-slate-200/60 hover:shadow-3xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={destination.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" 
                    alt={destination.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Top Left Badge - Popularity */}
                  <div className="absolute top-5 left-5">
                    <Badge className="bg-white/95 backdrop-blur-xl text-primary font-black rounded-2xl border-none shadow-2xl shadow-orange-500/30 text-[10px] flex items-center gap-1.5 px-3 py-1.5 ring-2 ring-white/50">
                      <Flame className="h-3.5 w-3.5 text-orange-500" /> {destination.popularity}% Hot
                    </Badge>
                  </div>

                  {/* Top Right - Heart Button */}
                  <Button 
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(destination.id)
                    }}
                    variant="ghost" 
                    size="icon"
                    className="absolute top-5 right-5 h-12 w-12 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-white shadow-2xl shadow-red-500/20 transition-all duration-300 hover:scale-110 active:scale-90 ring-2 ring-white/50"
                  >
                    <Heart 
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        favoriteIds.includes(destination.id)
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-slate-400 group-hover:text-red-400"
                      )}
                    />
                  </Button>

                  {/* Bottom Section - Name and Location */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-3xl font-heading font-extrabold text-white leading-tight drop-shadow-2xl">{destination.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 mt-2.5">
                      <MapPin className="h-4 w-4 drop-shadow-lg" />
                      <span className="text-xs font-black uppercase tracking-[0.15em] drop-shadow-lg">{destination.country}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-7 flex-1 flex flex-col justify-between space-y-6">
                  {/* Description */}
                  <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2">
                    {destination.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.slice(0, 3).map(highlight => (
                        <Badge 
                          key={highlight}
                          variant="secondary" 
                          className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 border-none font-bold uppercase text-[9px] px-3 py-1.5 shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                          {highlight}
                        </Badge>
                      ))}
                      {destination.highlights.length > 3 && (
                        <Badge 
                          variant="secondary" 
                          className="rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 text-primary border-none font-black uppercase text-[9px] px-3 py-1.5 shadow-sm"
                        >
                          +{destination.highlights.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1.5 p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50">
                      <p className="font-black text-slate-400 uppercase tracking-[0.1em] text-[9px] flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Best Time
                      </p>
                      <p className="font-black text-slate-900 text-xs">{destination.bestMonth}</p>
                    </div>
                    <div className="space-y-1.5 p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/50">
                      <p className="font-black text-slate-400 uppercase tracking-[0.1em] text-[9px]">Budget</p>
                      <p className="font-black text-slate-900 text-xs">{destination.budget}</p>
                    </div>
                  </div>

                  {/* Vibes Tags */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Vibes</p>
                    <div className="flex flex-wrap gap-2">
                      {destination.vibes.map(vibe => (
                        <Badge 
                          key={vibe}
                          className="rounded-xl bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 text-primary border border-primary/20 font-bold uppercase text-[9px] px-3 py-1.5 shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                          {vibe}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-5 border-t-2 border-slate-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-bold">{destination.travelers.toLocaleString()} travelers</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-br from-yellow-50 to-orange-50 px-3 py-1.5 rounded-xl border border-yellow-100/50">
                      <span className="text-yellow-500 font-black text-base">★</span>
                      <span className="font-black text-slate-900">{destination.rating}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        handlePlanTrip(destination.id, destination.name)
                      }}
                      variant="outline" 
                      className={cn(
                        "rounded-2xl h-12 border-2 font-heading font-black text-[10px] uppercase tracking-widest gap-2 shadow-md transition-all duration-300 active:scale-95",
                        plannedTrips.includes(destination.id)
                          ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100 shadow-green-500/20"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary hover:border-primary/30 hover:shadow-xl"
                      )}
                    >
                      {plannedTrips.includes(destination.id) ? (
                        <>
                          <Check className="h-4 w-4" /> Planned
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4" /> Plan Trip
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        handleShare(destination)
                      }}
                      className="rounded-2xl h-12 bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 font-heading font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 hover:scale-105"
                    >
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-24 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-slate-100">
              <MapPin className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-slate-900">No Destinations Found</h3>
              <p className="text-base text-slate-500 font-medium max-w-md mx-auto">
                Try adjusting your search or filters to discover more amazing destinations
              </p>
            </div>
            <Button 
              onClick={() => {
                setSearchQuery("")
                setSelectedVibe(null)
              }}
              className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5 text-primary hover:from-primary/10 hover:to-blue-500/10 font-heading font-black text-[11px] uppercase tracking-widest px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-blue-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {DESTINATIONS.length}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Total Destinations</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-purple-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {DESTINATIONS.reduce((sum, d) => sum + d.travelers, 0).toLocaleString()}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Active Travelers</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-yellow-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-yellow-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-500">
                <span className="text-5xl">★</span>
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {(DESTINATIONS.reduce((sum, d) => sum + d.rating, 0) / DESTINATIONS.length).toFixed(1)}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Average Rating</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}