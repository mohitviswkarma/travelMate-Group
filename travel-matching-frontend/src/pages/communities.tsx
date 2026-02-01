import { useNavigate } from "react-router-dom"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  Users,
  Compass, 
  Search,
  Heart,
  MessageCircle,
  TrendingUp,
  Share2,
  Zap,
  Check,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Community {
  id: string
  name: string
  description: string
  image: string
  category: string
  members: number
  growth: number
  rating: number
  tags: string[]
  featured: boolean
  joinedBy?: string
  activeToday: number
  travelFocus?: string
}

const COMMUNITIES: Community[] = [
  {
    id: "1",
    name: "Budget Backpackers",
    category: "Travel Style",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80",
    description: "Community of travelers who love exploring on a budget. Share tips, hostels, and cheap eats from around the world.",
    members: 18432,
    growth: 24,
    rating: 4.8,
    tags: ["Budget-Friendly", "Backpacking", "Hostels", "Street Food"],
    featured: true,
    activeToday: 2341,
    travelFocus: "Budget Travel"
  },
  {
    id: "2",
    name: "Adventure Seekers",
    category: "Travel Style",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&q=80",
    description: "For thrill-seekers and adventure enthusiasts. Rock climbing, skydiving, hiking, and extreme sports awaits!",
    members: 14256,
    growth: 32,
    rating: 4.9,
    tags: ["Adventure", "Hiking", "Extreme Sports", "Outdoor"],
    featured: true,
    activeToday: 1876,
    travelFocus: "Adventure Travel"
  },
  {
    id: "3",
    name: "Luxury Travelers",
    category: "Travel Style",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80",
    description: "Curated experiences for travelers seeking premium accommodations, fine dining, and exclusive access.",
    members: 8934,
    growth: 18,
    rating: 4.7,
    tags: ["Luxury", "5-Star Hotels", "Fine Dining", "Exclusive"],
    featured: false,
    activeToday: 945,
    travelFocus: "Luxury Travel"
  },
  {
    id: "4",
    name: "Foodie Travelers",
    category: "Interests",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80",
    description: "Discover the world through food! Share culinary adventures, street food, cooking classes, and restaurant recommendations.",
    members: 22145,
    growth: 28,
    rating: 4.9,
    tags: ["Food", "Culinary", "Street Food", "Local Cuisine"],
    featured: true,
    activeToday: 3012,
    travelFocus: "Food Tourism"
  },
  {
    id: "5",
    name: "Solo Female Travelers",
    category: "Demographics",
    image: "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=600&fit=crop&q=80",
    description: "A supportive community for women traveling alone. Safety tips, destination advice, and friendship await.",
    members: 31256,
    growth: 35,
    rating: 4.8,
    tags: ["Women", "Solo Travel", "Safety", "Empowerment"],
    featured: true,
    activeToday: 4234,
    travelFocus: "Solo Travel"
  },
  {
    id: "6",
    name: "Digital Nomads",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80",
    description: "For remote workers and digital professionals. Co-working spaces, internet speeds, and workation destinations.",
    members: 19876,
    growth: 42,
    rating: 4.8,
    tags: ["Remote Work", "Nomad Life", "Co-working", "Productivity"],
    featured: true,
    activeToday: 2567,
    travelFocus: "Work & Travel"
  },
  {
    id: "7",
    name: "Nature Lovers",
    category: "Interests",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80",
    description: "Celebrate nature's beauty. National parks, wildlife, national gardens, and eco-tourism experiences.",
    members: 25634,
    growth: 26,
    rating: 4.9,
    tags: ["Nature", "Hiking", "Parks", "Eco-Tourism"],
    featured: true,
    activeToday: 3456,
    travelFocus: "Nature Tourism"
  },
  {
    id: "8",
    name: "Cultural Immersion",
    category: "Travel Style",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=600&fit=crop&q=80",
    description: "Deep dive into local cultures. Language exchanges, homestays, festivals, and authentic experiences.",
    members: 16745,
    growth: 29,
    rating: 4.7,
    tags: ["Culture", "Language", "Homestay", "Festivals"],
    featured: false,
    activeToday: 1834,
    travelFocus: "Cultural Travel"
  },
  {
    id: "9",
    name: "Photography Enthusiasts",
    category: "Interests",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop&q=80",
    description: "Capture the world's beauty. Photo tours, tips, location scouting, and gear discussions.",
    members: 13567,
    growth: 31,
    rating: 4.8,
    tags: ["Photography", "Gear", "Photo Tours", "Landscapes"],
    featured: false,
    activeToday: 1456,
    travelFocus: "Photography"
  },
  {
    id: "10",
    name: "Family Travelers",
    category: "Demographics",
    image: "https://images.unsplash.com/photo-1476304884326-cd2c88572c5f?w=800&h=600&fit=crop&q=80",
    description: "Travel with kids! Kid-friendly destinations, family resorts, activities, and parenting tips on the road.",
    members: 20123,
    growth: 22,
    rating: 4.8,
    tags: ["Family", "Kids", "Safe Destinations", "Activities"],
    featured: true,
    activeToday: 2876,
    travelFocus: "Family Travel"
  },
  {
    id: "11",
    name: "Wellness & Yoga Retreat",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80",
    description: "Mind and body wellness. Yoga retreats, meditation, spa destinations, and health-conscious travel.",
    members: 15432,
    growth: 38,
    rating: 4.9,
    tags: ["Wellness", "Yoga", "Meditation", "Spas"],
    featured: false,
    activeToday: 1765,
    travelFocus: "Wellness Travel"
  },
  {
    id: "12",
    name: "Pet-Friendly Travelers",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop&q=80",
    description: "Travel with your furry friends! Pet-friendly hotels, airlines, activities, and destination guides.",
    members: 12345,
    growth: 25,
    rating: 4.7,
    tags: ["Pets", "Dogs", "Pet Hotels", "Adventures"],
    featured: false,
    activeToday: 1123,
    travelFocus: "Pet Travel"
  }
]

export default function CommunitiesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [joinedIds, setJoinedIds] = useState<string[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [showJoinToast, setShowJoinToast] = useState(false)
  const [joinedCommunityName, setJoinedCommunityName] = useState("")
  const [showShareToast, setShowShareToast] = useState(false)
  const [sharedCommunity, setSharedCommunity] = useState("")

  const filteredCommunities = useMemo(() => {
    return COMMUNITIES.filter(community => {
      const matchesSearch = 
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = !selectedCategory || community.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const allCategories = Array.from(
    new Set(COMMUNITIES.map(c => c.category))
  ).sort()

  const featuredCommunities = COMMUNITIES.filter(c => c.featured)

  const toggleJoin = (id: string, name: string) => {
    const isJoining = !joinedIds.includes(id)
    setJoinedIds(prev => 
      prev.includes(id) 
        ? prev.filter(joined => joined !== id)
        : [...prev, id]
    )
    
    if (isJoining) {
      setJoinedCommunityName(name)
      setShowJoinToast(true)
      setTimeout(() => setShowJoinToast(false), 3000)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const handleChat = (communityName: string) => {
    console.log(`Opening chat for ${communityName}`)
    // In a real app, this would navigate to a chat page
  }

  const handleShare = async (community: Community) => {
    const shareData = {
      title: community.name,
      text: `Join ${community.name} on our travel app! ${community.description}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )
        setSharedCommunity(community.name)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 3000)
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 font-body selection:bg-primary selection:text-white pb-24">
      {/* Toast Notifications */}
      {showJoinToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <Card className="rounded-2xl border-none bg-white shadow-2xl shadow-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Welcome!</p>
                <p className="text-xs text-slate-500">Joined {joinedCommunityName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showShareToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <Card className="rounded-2xl border-none bg-white shadow-2xl shadow-blue-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Link Copied!</p>
                <p className="text-xs text-slate-500">{sharedCommunity} shared</p>
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
              <div className="bg-gradient-to-br from-primary via-purple-600 to-blue-600 p-2.5 rounded-2xl shadow-xl shadow-primary/30 ring-4 ring-primary/10">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-black tracking-tight text-slate-900 uppercase bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Communities
              </h1>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-3">
            {joinedIds.length > 0 && (
              <Badge className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-black rounded-xl border-none shadow-lg shadow-green-500/30 px-3 py-1.5">
                <Check className="h-3 w-3 mr-1" /> {joinedIds.length} Joined
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-10">
        {/* Title Section */}
        <div className="mb-12 space-y-3">
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
            Join{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent underline decoration-accent/40 decoration-[6px] underline-offset-[12px]">
              Communities
            </span>
          </h2>
          <p className="text-slate-500 font-semibold text-lg">
            Connect with travelers who share your interests, travel style, and passions.
          </p>
        </div>

        {/* Featured Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Featured Communities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCommunities.map(community => (
              <Card 
                key={community.id}
                className="group rounded-[3rem] border-2 border-slate-100/50 bg-white shadow-xl shadow-slate-200/60 hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Featured Badge */}
                <Badge className="absolute top-5 right-5 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-none rounded-xl font-black text-[10px] shadow-xl shadow-orange-500/30 px-3 py-1.5 ring-2 ring-white/50">
                  ⭐ Featured
                </Badge>

                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={community.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" 
                    alt={community.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Bottom Section - Name */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-2xl font-heading font-extrabold text-white leading-tight drop-shadow-2xl">{community.name}</h3>
                    <p className="text-xs font-black text-white/80 uppercase tracking-[0.15em] mt-2 drop-shadow-lg">{community.category}</p>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  {/* Member Count */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100/50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-black text-sm">{(community.members / 1000).toFixed(1)}K</span>
                    </div>
                    <Badge className="bg-green-500/10 text-green-700 border-none font-black text-[9px] px-2 py-1">
                      <TrendingUp className="h-3 w-3 mr-0.5" /> +{community.growth}%
                    </Badge>
                  </div>

                  {/* Join Button */}
                  <Button 
                    onClick={() => toggleJoin(community.id, community.name)}
                    className={cn(
                      "w-full h-12 rounded-2xl font-heading font-black text-[11px] uppercase tracking-widest gap-2 shadow-xl transition-all duration-300 active:scale-95 hover:scale-105",
                      joinedIds.includes(community.id)
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
                        : "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-primary/30"
                    )}
                  >
                    {joinedIds.includes(community.id) ? (
                      <>
                        <Check className="h-4 w-4" /> Joined
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4" /> Join Community
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 overflow-hidden relative group mb-14 hover:shadow-3xl hover:shadow-primary/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full -ml-48 -mb-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          
          <CardContent className="p-10 md:p-12 relative z-10 space-y-8">
            {/* Search Input */}
            <div className="relative group/search">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-primary transition-colors duration-300" />
              <Input 
                placeholder="Search communities by name, interest, or tags..."
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

            {/* Category Filters */}
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Filter by category
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={cn(
                    "rounded-full h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl",
                    selectedCategory === null 
                      ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-primary/30 scale-105 ring-4 ring-primary/20" 
                      : "border-2 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:scale-105 active:scale-95"
                  )}
                >
                  All Communities
                </Button>
                {allCategories.map(category => (
                  <Button 
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={cn(
                      "rounded-full h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl",
                      selectedCategory === category 
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-primary/30 scale-105 ring-4 ring-primary/20" 
                        : "border-2 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:scale-105 active:scale-95"
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            {searchQuery || selectedCategory ? (
              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                <p className="text-sm font-bold text-slate-600">
                  <span className="text-primary text-lg font-black">{filteredCommunities.length}</span> communities found
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
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

        {/* All Communities Grid */}
        {filteredCommunities.length > 0 ? (
          <div className="space-y-8">
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">All Communities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCommunities.map(community => (
                <Card 
                  key={community.id}
                  className="group rounded-[3rem] border-2 border-slate-100/50 bg-white shadow-xl shadow-slate-200/60 hover:shadow-3xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={community.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" 
                      alt={community.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Top Right - Heart Button */}
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(community.id)
                      }}
                      variant="ghost" 
                      size="icon"
                      className="absolute top-5 right-5 h-12 w-12 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-white shadow-2xl shadow-red-500/20 transition-all duration-300 hover:scale-110 active:scale-90 ring-2 ring-white/50"
                    >
                      <Heart 
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          favoriteIds.includes(community.id)
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-slate-400 group-hover:text-red-400"
                        )}
                      />
                    </Button>

                    {/* Top Left Badge - Growth */}
                    <div className="absolute top-5 left-5">
                      <Badge className="bg-white/95 backdrop-blur-xl text-green-600 font-black rounded-2xl border-none shadow-2xl shadow-green-500/30 text-[10px] flex items-center gap-1.5 px-3 py-1.5 ring-2 ring-white/50">
                        <TrendingUp className="h-3.5 w-3.5" /> +{community.growth}%
                      </Badge>
                    </div>

                    {/* Bottom Section - Name and Category */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-3xl font-heading font-extrabold text-white leading-tight drop-shadow-2xl">{community.name}</h3>
                      <p className="text-xs font-black text-white/80 uppercase tracking-[0.15em] mt-2.5 drop-shadow-lg">{community.category}</p>
                    </div>
                  </div>

                  <CardContent className="p-7 flex-1 flex flex-col justify-between space-y-6">
                    {/* Description */}
                    <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2">
                      {community.description}
                    </p>

                    {/* Tags */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {community.tags.slice(0, 3).map(tag => (
                          <Badge 
                            key={tag}
                            variant="secondary" 
                            className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 border-none font-bold uppercase text-[9px] px-3 py-1.5 shadow-sm hover:shadow-md transition-all hover:scale-105"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {community.tags.length > 3 && (
                          <Badge 
                            variant="secondary" 
                            className="rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary border-none font-black uppercase text-[9px] px-3 py-1.5 shadow-sm"
                          >
                            +{community.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="pt-5 border-t-2 border-slate-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1.5 p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100/50">
                          <p className="font-black text-slate-400 uppercase tracking-[0.1em] text-[9px]">Members</p>
                          <p className="font-black text-slate-900">{(community.members / 1000).toFixed(1)}K</p>
                        </div>
                        <div className="space-y-1.5 p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/50">
                          <p className="font-black text-slate-400 uppercase tracking-[0.1em] text-[9px]">Active Today</p>
                          <p className="font-black text-slate-900">{(community.activeToday / 1000).toFixed(1)}K</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-2.5 rounded-2xl border border-yellow-100/50">
                        <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Rating</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-500 font-black text-lg">★</span>
                          <span className="font-black text-slate-900">{community.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        onClick={(e) => {
                          e.preventDefault()
                          handleChat(community.name)
                        }}
                        variant="outline" 
                        className="rounded-2xl h-12 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary hover:border-primary/30 font-heading font-black text-[10px] uppercase tracking-widest gap-2 shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 hover:scale-105"
                      >
                        <MessageCircle className="h-4 w-4" /> Chat
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault()
                          toggleJoin(community.id, community.name)
                        }}
                        className={cn(
                          "rounded-2xl h-12 font-heading font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl transition-all duration-300 active:scale-95 hover:scale-105",
                          joinedIds.includes(community.id)
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
                            : "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-primary/30"
                        )}
                      >
                        {joinedIds.includes(community.id) ? (
                          <>
                            <Check className="h-4 w-4" /> Joined
                          </>
                        ) : (
                          <>
                            <Users className="h-4 w-4" /> Join
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Share Button - Full Width */}
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        handleShare(community)
                      }}
                      variant="outline"
                      className="w-full h-11 rounded-2xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100 font-heading font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Share Community
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-span-full py-24 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-slate-100">
              <Users className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-slate-900">No Communities Found</h3>
              <p className="text-base text-slate-500 font-medium max-w-md mx-auto">
                Try adjusting your search or filters to discover more communities
              </p>
            </div>
            <Button 
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
              className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 text-primary hover:from-primary/10 hover:to-purple-500/10 font-heading font-black text-[11px] uppercase tracking-widest px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-purple-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {COMMUNITIES.length}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Active Communities</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-blue-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <Compass className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {COMMUNITIES.reduce((sum, c) => sum + c.members, 0).toLocaleString()}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Total Members</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-yellow-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-yellow-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-500">
                <span className="text-5xl">★</span>
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {(COMMUNITIES.reduce((sum, c) => sum + c.rating, 0) / COMMUNITIES.length).toFixed(1)}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Average Rating</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}