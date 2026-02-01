import { useNavigate } from "react-router-dom"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  Compass, 
  Search,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  MapPin,
  Eye,
  X,
  BookOpen,
  Check,
  Bookmark
} from "lucide-react"
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  authorImage: string
  date: string
  category: string
  location: string
  readTime: number
  views: number
  likes: number
  tags: string[]
  featured: boolean
}

const BLOGS: Blog[] = [
  {
    id: "1",
    title: "48 Hours in Tokyo: The Ultimate Weekend Itinerary",
    excerpt: "Discover the best of Tokyo in just 48 hours. From ancient temples to neon-lit streets, this itinerary covers everything you need.",
    content: `Tokyo is a city of contrasts - where ancient traditions meet cutting-edge modernity. In just 48 hours, you can experience the essence of what makes this city so magical.

Day 1: Start your morning at Tsukiji Outer Market for the freshest sushi breakfast. The energy here is incredible, with vendors calling out their wares and tourists and locals mingling.

After breakfast, head to Senso-ji Temple in Asakusa, Tokyo's oldest temple. Walk through the iconic red lantern gate and explore the bustling shopping streets filled with traditional souvenirs.

In the afternoon, visit Meiji Shrine, a serene Shinto shrine nestled in a peaceful forest. The contrast between the busy streets outside and the tranquil forest inside is remarkable.

As evening approaches, head to Shibuya Crossing, the world's busiest pedestrian crossing. Watch the organized chaos as thousands of people cross simultaneously - it's truly a sight to behold.

Day 2: Start with a visit to the teamLab Borderless digital art museum. This immersive experience is unlike anything you've seen before, with interactive digital installations that respond to your movements.

In the afternoon, explore the fashion and youth culture of Harajuku. Walk down Takeshita Street and discover quirky fashion boutiques, manga shops, and crepe stands.

End your trip in Roppongi, where you can enjoy panoramic views of the city from Tokyo Skytree or Tokyo Tower. Grab dinner at a conveyor belt sushi restaurant - a uniquely Japanese dining experience.

Tokyo is a city that never stops surprising you. Every corner has something new to discover, and 48 hours just might leave you wanting more.`,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop&q=80",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
    date: "January 15, 2026",
    category: "City Guide",
    location: "Tokyo, Japan",
    readTime: 8,
    views: 12450,
    likes: 3421,
    tags: ["Tokyo", "Japan", "Weekend Trip", "City Guide", "Budget-Friendly"],
    featured: true
  },
  {
    id: "2",
    title: "Backpacking Through Southeast Asia on $50 a Day",
    excerpt: "Learn how to explore Thailand, Vietnam, and Cambodia while keeping your budget tight. Insider tips on hostels, food, and transport.",
    content: `Southeast Asia is a backpacker's paradise, and you absolutely can travel through it on just $50 a day. Here's how I did it.

Accommodation: Hostels are your best friend. A decent bed in a hostel costs $8-15 per night. I stayed in places like NapPark Hostel in Bangkok and Hanoi Old Quarter View, which were clean, social, and affordable.

Food: This is where you can really save money in Southeast Asia. Street food is delicious and costs $1-3 per meal. Pad Thai on the street is better and cheaper than any restaurant. Visit local markets early in the morning for the best deals.

Transport: Buses and trains are incredibly cheap. A 12-hour bus ride in Vietnam costs around $8-12. Internal flights can be found for $25-40 if you book in advance.

Activities: Many of the best activities are free or very cheap. Watching the sunrise over Angkor Wat, hiking in northern Thailand, and exploring local neighborhoods don't cost a thing.

My daily breakdown:
- Hostel: $12
- Food: $15
- Activities: $10
- Transport: $8
- Miscellaneous: $5

Total: $50 per day

The key is to travel slowly, eat where locals eat, use public transport, and focus on free activities. You'll have an amazing experience without breaking the bank.`,
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=600&fit=crop&q=80",
    author: "Marcus Johnson",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    date: "January 12, 2026",
    category: "Budget Travel",
    location: "Southeast Asia",
    readTime: 10,
    views: 18920,
    likes: 5634,
    tags: ["Budget Travel", "Southeast Asia", "Backpacking", "Thailand", "Vietnam"],
    featured: true
  },
  {
    id: "3",
    title: "Hiking Machu Picchu: A Life-Changing Journey",
    excerpt: "My experience trekking to Machu Picchu and why it's on every traveler's bucket list. Tips for preparation and the actual hike.",
    content: `Standing at the gates of Machu Picchu at sunrise is an experience that will change you forever. Here's my story of how I got there.

Preparation: The Inca Trail hike takes 4 days and 3 nights, and it's challenging. I trained for 3 months, doing cardio and hiking with a weighted backpack. Altitude is a real concern - Machu Picchu sits at 7,970 feet above sea level.

Day 1: We started at kilometer 82 on the railway to Aguas Calientes. The first day is relatively easy, about 8 miles through cloud forest. The scenery is already stunning.

Day 2: This is the toughest day. We climbed "Dead Woman's Pass," the highest point of the trail at 13,100 feet. My lungs were burning, but the views were absolutely worth it. We camped at a lower elevation that night.

Day 3: Another challenging day with multiple mountain passes. My legs were sore, but adrenaline kept me going. We could see Machu Picchu in the distance, which motivated us to push harder.

Day 4: The final day, we woke up at 4 AM to reach the Sun Gate by sunrise. As the sun broke over the mountains and illuminated Machu Picchu, I had tears streaming down my face. All the pain and effort was worth it.

Machu Picchu is more than just a tourist destination - it's a spiritual journey. Hiking the Inca Trail was one of the best decisions I've ever made.`,
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=600&fit=crop&q=80",
    author: "Emma Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
    date: "January 10, 2026",
    category: "Adventure",
    location: "Machu Picchu, Peru",
    readTime: 9,
    views: 22341,
    likes: 7213,
    tags: ["Peru", "Machu Picchu", "Hiking", "Adventure", "Trek"],
    featured: true
  },
  {
    id: "4",
    title: "Finding Myself in Bali: A Solo Travel Story",
    excerpt: "How a solo trip to Bali changed my perspective on life, spirituality, and what I truly value. A personal journey of self-discovery.",
    content: `I arrived in Bali with a broken heart and a lost soul. Three months later, I left transformed.

Week 1: I spent my first week in Ubud, the cultural heart of Bali. I stayed in a small guesthouse and tried to find my footing. Yoga at sunrise became my daily ritual.

Week 2-3: I took a meditation retreat in the rice terraces. Sitting in silence for 10 days was terrifying at first, but it gave me space to process everything I'd been avoiding. By day 5, I wasn't thinking about my ex anymore. By day 10, I wasn't thinking about much of anything - just being present in the moment.

Week 4-6: I volunteered at an elephant sanctuary. Working with these magnificent creatures taught me about patience, gentleness, and the interconnectedness of all living beings. Watching baby elephants play reminded me to find joy in simple things.

Week 7-9: I took a cooking class, learned to surf, explored hidden temples, and made friends from around the world. Bali's vibrant travel community welcomed me with open arms.

Week 10-12: By this point, I wasn't sure if I wanted to leave. Bali had healed me in ways I didn't expect. The combination of spiritual practices, natural beauty, and warm people had worked their magic.

When I left Bali, I didn't leave my problems behind - but I left with new tools to handle them. Bali taught me that sometimes we need to get lost to find ourselves.`,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=600&fit=crop&q=80",
    author: "Lisa Park",
    authorImage: "https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=200&h=200&fit=crop&q=80",
    date: "January 8, 2026",
    category: "Personal Stories",
    location: "Bali, Indonesia",
    readTime: 11,
    views: 15670,
    likes: 6432,
    tags: ["Bali", "Solo Travel", "Self-Discovery", "Spirituality", "Personal"],
    featured: true
  },
  {
    id: "5",
    title: "Paris in Spring: A Romantic City Guide",
    excerpt: "The best time to visit Paris is spring. Discover hidden gems, charming cafes, and why Paris truly is the city of love.",
    content: `Spring in Paris is magical. The streets are lined with cherry blossoms, sidewalk cafes come alive, and romance is in the air.

Where to Stay: Skip the touristy areas and stay in the Marais or the 11th arrondissement. These neighborhoods have authentic cafes, galleries, and vintage shops that give you a real Parisian experience.

What to See: Sure, the Eiffel Tower and Louvre are iconic, but in spring, take time to explore the lesser-known museums like the Musée de Montmartre or the Orangerie. 

Where to Eat: Forget fancy restaurants. The best meals in Paris are in small bistros serving traditional French cuisine. Try coq au vin, steak frites, and crème brûlée. Wash it down with French wine at sunset by the Seine.

What to Do: Wander through neighborhoods without a map. Get lost in the Latin Quarter, climb Montmartre for the views, relax in Luxembourg Gardens, and watch the street performers.

Best Time: Visit in April or May. The weather is perfect, the flowers are blooming, and it's not yet peak tourist season.

Pro Tips: 
- Buy a carnet of 10 metro tickets instead of singles
- Parisians appreciate effort - learn basic French phrases
- Breakfast is light, lunch is the main meal, dinner is lighter
- Museums have late-night hours on certain days

Paris in spring will capture your heart and make you understand why it's called the city of love.`,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop&q=80",
    author: "Antoine Leclerc",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
    date: "January 5, 2026",
    category: "City Guide",
    location: "Paris, France",
    readTime: 7,
    views: 19234,
    likes: 5876,
    tags: ["Paris", "France", "Spring", "Romance", "City Guide"],
    featured: false
  },
  {
    id: "6",
    title: "New York City Food Tour: Where to Eat the Best",
    excerpt: "From street hot dogs to Michelin-starred restaurants, explore NYC's diverse food scene. A complete foodie's guide to the city.",
    content: `New York City is a food lover's paradise. Every cuisine imaginable is represented here, and the quality is exceptional.

Breakfast: Start your day at a classic NYC deli. Bagels with lox and cream cheese from Russ & Daughters is iconic. Or grab a breakfast sandwich from a bodega - don't be surprised by how good they are.

Lunch: Try authentic cuisines from different neighborhoods:
- Chinatown: Soup dumplings and dim sum
- Little Italy: Pasta and sauce (go to a neighborhood spot, not a tourist trap)
- Koreatown: Korean BBQ and bibimbap
- Jackson Heights, Queens: South Asian street food

Dinner: Whether you want fine dining or casual, NYC has it all. Three Michelin-starred Eleven Madison Park, or a pizza slice from L&B Spumoni Gardens.

Dessert: Get dessert from a neighborhood bakery. Sfogliatelles in Little Italy, black-and-white cookies, or chocolate chip cookies from William Greenberg Desserts.

Neighborhoods to Explore:
- East Village: Eclectic mix of cuisines
- Chinatown: Authentic Asian food
- Koreatown: Korean restaurants and karaoke
- Hell's Kitchen: Modern American restaurants
- Astoria, Queens: Greek and Mediterranean food

Pro Tips:
- Eat where you see locals eating
- Many restaurants have happy hour specials
- Take cooking classes at schools like IICI
- Visit restaurants without reservations for lower prices

NYC's food scene reflects its diversity and energy. Every meal is an adventure.`,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop&q=80",
    author: "David Miller",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    date: "January 2, 2026",
    category: "Food & Dining",
    location: "New York City, USA",
    readTime: 8,
    views: 21456,
    likes: 6789,
    tags: ["NYC", "Food", "Dining", "Foodie", "Street Food"],
    featured: false
  },
  {
    id: "7",
    title: "Wildlife Safari in Kenya: An Unforgettable Adventure",
    excerpt: "Experience the Big Five and pristine African landscapes. A complete guide to planning your first safari in Kenya.",
    content: `Waking up to the sound of lions roaring in the distance is something you never forget. My safari in Kenya was the adventure of a lifetime.

Best Time to Visit: June to October for the Great Migration, or January to March for calving season. The weather is perfect during these times.

Where to Go: The Masai Mara is the most popular and for good reason. The concentration of wildlife here is incredible.

What to See: 
- The Big Five: Lion, Leopard, Elephant, Buffalo, Rhino
- Zebras, giraffes, wildebeest, and countless bird species
- The Great Migration in July-August

What to Expect:
- Early morning and late afternoon game drives
- Professional guides who know animal behavior
- Stunning landscapes at golden hour
- Unexpected wildlife encounters

Accommodation: Stay in a mix of luxury lodges and budget camps. Both offer unique experiences.

Pro Tips:
- Book with reputable tour operators
- Pack neutral-colored clothing (bright colors scare animals)
- Bring binoculars and a good camera
- Be respectful of wildlife and follow guide instructions
- Consider a hot air balloon ride for an aerial perspective

A safari in Kenya is not just about seeing animals - it's about experiencing the raw beauty of Africa and understanding conservation efforts. It will change how you see the world.`,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=600&fit=crop&q=80",
    author: "James Wilson",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    date: "December 28, 2025",
    category: "Wildlife",
    location: "Kenya",
    readTime: 9,
    views: 16234,
    likes: 5123,
    tags: ["Kenya", "Safari", "Wildlife", "Adventure", "Africa"],
    featured: false
  },
  {
    id: "8",
    title: "Digital Nomad Life: Working From Chiang Mai",
    excerpt: "The realities of being a digital nomad. How I work 30 hours a week and travel full-time from Chiang Mai.",
    content: `Chiang Mai is the digital nomad capital of Southeast Asia, and for good reason. Here's what life looks like when you work remotely from this magical city.

Cost of Living: Chiang Mai is incredibly affordable. 
- Apartment: $300-500/month
- Food: $2-5 per meal
- Co-working space: $50-100/month
- Internet: $20/month

Work Environment: There are dozens of co-working spaces. Punspace, Punspace Hub, and Wake Sano are popular and offer fast, reliable internet - essential for remote work.

Daily Routine: 
- 6 AM: Wake up, exercise, breakfast at a local market
- 9 AM: Work from co-working space (3-4 hours)
- 1 PM: Lunch at a Thai restaurant (usually $1-2 for a full meal)
- 2-5 PM: Work again or explore the city
- 5 PM: Sunset at a local temple or cafe
- 7 PM: Dinner with other nomads

Social Life: The digital nomad community is huge and welcoming. You'll make friends quickly through co-working spaces, hostels, and Facebook groups.

Challenges:
- Time zone differences with home country
- Internet can be unreliable
- Easy to work too much when your office is wherever you want
- Missing family and friends back home

Benefits:
- Incredibly low cost of living
- Amazing food and culture
- Friendly people
- Perfect weather most of the year
- Flexible schedule

Chiang Mai has given me the freedom to work, travel, and live on my own terms. If you're considering digital nomad life, this is the place to start.`,
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&h=600&fit=crop&q=80",
    author: "Alex Thompson",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
    date: "December 25, 2025",
    category: "Digital Nomad",
    location: "Chiang Mai, Thailand",
    readTime: 7,
    views: 14567,
    likes: 4523,
    tags: ["Digital Nomad", "Thailand", "Remote Work", "Chiang Mai", "Lifestyle"],
    featured: false
  }
]

export default function StoriesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [likedBlogIds, setLikedBlogIds] = useState<string[]>([])
  const [savedBlogIds, setSavedBlogIds] = useState<string[]>([])
  const [showLikeToast, setShowLikeToast] = useState(false)
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const filteredBlogs = useMemo(() => {
    return BLOGS.filter(blog => {
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = !selectedCategory || blog.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const allCategories = Array.from(
    new Set(BLOGS.map(b => b.category))
  ).sort()

  const featuredBlogs = BLOGS.filter(b => b.featured)

  const handleOpenBlog = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsModalOpen(true)
  }

  const toggleLike = (id: string) => {
    const isLiking = !likedBlogIds.includes(id)
    setLikedBlogIds(prev => 
      prev.includes(id) 
        ? prev.filter(liked => liked !== id)
        : [...prev, id]
    )
    
    if (isLiking) {
      setToastMessage("Story liked!")
      setShowLikeToast(true)
      setTimeout(() => setShowLikeToast(false), 2000)
    }
  }

  const toggleSave = (id: string) => {
    const isSaving = !savedBlogIds.includes(id)
    setSavedBlogIds(prev => 
      prev.includes(id) 
        ? prev.filter(saved => saved !== id)
        : [...prev, id]
    )
    
    setToastMessage(isSaving ? "Story saved!" : "Story removed")
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 2000)
  }

  const handleShare = async (blog: Blog) => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )
        setToastMessage("Link copied!")
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 2000)
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  const handleComment = () => {
    console.log("Opening comment section")
    // In a real app, this would open a comment modal or navigate to comments
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-pink-50/20 font-body selection:bg-primary selection:text-white pb-24">
      {/* Toast Notifications */}
      {showLikeToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <Card className="rounded-2xl border-none bg-white shadow-2xl shadow-red-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <p className="font-bold text-sm text-slate-900">{toastMessage}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {showSaveToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <Card className="rounded-2xl border-none bg-white shadow-2xl shadow-blue-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-white fill-white" />
              </div>
              <p className="font-bold text-sm text-slate-900">{toastMessage}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {showShareToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <Card className="rounded-2xl border-none bg-white shadow-2xl shadow-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="font-bold text-sm text-slate-900">{toastMessage}</p>
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
              <div className="bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600 p-2.5 rounded-2xl shadow-xl shadow-orange-500/30 ring-4 ring-orange-500/10">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-black tracking-tight text-slate-900 uppercase bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Travel Stories
              </h1>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3">
            {savedBlogIds.length > 0 && (
              <Badge className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-black rounded-xl border-none shadow-lg shadow-blue-500/30 px-3 py-1.5">
                <Bookmark className="h-3 w-3 mr-1 fill-white" /> {savedBlogIds.length}
              </Badge>
            )}
            {likedBlogIds.length > 0 && (
              <Badge className="bg-gradient-to-br from-red-500 to-pink-600 text-white font-black rounded-xl border-none shadow-lg shadow-red-500/30 px-3 py-1.5">
                <Heart className="h-3 w-3 mr-1 fill-white" /> {likedBlogIds.length}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-10">
        {/* Title Section */}
        <div className="mb-12 space-y-3">
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
            Travel{" "}
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent underline decoration-orange-400/40 decoration-[6px] underline-offset-[12px]">
              Stories
            </span>
          </h2>
          <p className="text-slate-500 font-semibold text-lg">
            Inspiring tales from travelers around the world. Get inspired and plan your next adventure.
          </p>
        </div>

        {/* Featured Section */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Featured Stories</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredBlogs.slice(0, 2).map(blog => (
              <Card 
                key={blog.id}
                onClick={() => handleOpenBlog(blog)}
                className="group rounded-[3rem] border-2 border-slate-100/50 bg-white shadow-xl shadow-slate-200/60 hover:shadow-3xl hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={blog.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" 
                    alt={blog.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute top-5 left-5 flex gap-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black rounded-xl border-none shadow-xl shadow-orange-500/30 text-[10px] px-3 py-1.5 ring-2 ring-white/50">
                      ⭐ Featured
                    </Badge>
                    <Badge className="bg-white/95 backdrop-blur-xl text-slate-700 font-black rounded-xl border-none shadow-xl text-[10px] px-3 py-1.5 ring-2 ring-white/50">
                      {blog.category}
                    </Badge>
                  </div>

                  {/* Save Button */}
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSave(blog.id)
                    }}
                    variant="ghost" 
                    size="icon"
                    className="absolute top-5 right-5 h-12 w-12 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ring-2 ring-white/50"
                  >
                    <Bookmark 
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        savedBlogIds.includes(blog.id)
                          ? "fill-blue-500 text-blue-500 scale-110"
                          : "text-slate-400"
                      )}
                    />
                  </Button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-3xl font-heading font-extrabold text-white leading-tight mb-3 drop-shadow-2xl">{blog.title}</h3>
                    <p className="text-sm text-white/90 line-clamp-2 drop-shadow-lg font-medium">{blog.excerpt}</p>
                    
                    {/* Author info */}
                    <div className="flex items-center gap-3 mt-4">
                      <img 
                        src={blog.authorImage}
                        alt={blog.author}
                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                      <div>
                        <p className="font-black text-sm text-white drop-shadow-lg">{blog.author}</p>
                        <p className="text-xs text-white/80 drop-shadow-lg">{blog.readTime} min read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-orange-500/10 overflow-hidden relative group mb-14 hover:shadow-3xl hover:shadow-pink-500/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-transparent rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full -ml-48 -mb-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          
          <CardContent className="p-10 md:p-12 relative z-10 space-y-8">
            {/* Search Input */}
            <div className="relative group/search">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-orange-600 transition-colors duration-300" />
              <Input 
                placeholder="Search stories by title, tags, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 rounded-3xl border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white font-medium text-base shadow-sm hover:shadow-md"
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
                <Compass className="h-4 w-4 text-orange-600" />
                Filter by category
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={cn(
                    "rounded-full h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl",
                    selectedCategory === null 
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-orange-500/30 scale-105 ring-4 ring-orange-500/20" 
                      : "border-2 border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-500/30 hover:bg-orange-500/5 hover:scale-105 active:scale-95"
                  )}
                >
                  All Stories
                </Button>
                {allCategories.map(category => (
                  <Button 
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={cn(
                      "rounded-full h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl",
                      selectedCategory === category 
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-orange-500/30 scale-105 ring-4 ring-orange-500/20" 
                        : "border-2 border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-500/30 hover:bg-orange-500/5 hover:scale-105 active:scale-95"
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
                  <span className="text-orange-600 text-lg font-black">{filteredBlogs.length}</span> stories found
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                  variant="ghost"
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors"
                >
                  Clear All
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* All Stories Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="space-y-8">
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">All Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <Card 
                  key={blog.id}
                  onClick={() => handleOpenBlog(blog)}
                  className="group rounded-[3rem] border-2 border-slate-100/50 bg-white shadow-xl shadow-slate-200/60 hover:shadow-3xl hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={blog.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" 
                      alt={blog.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Top Left Badge - Category */}
                    <div className="absolute top-5 left-5">
                      <Badge className="bg-white/95 backdrop-blur-xl text-slate-700 font-black rounded-2xl border-none shadow-2xl text-[10px] px-3 py-1.5 ring-2 ring-white/50">
                        {blog.category}
                      </Badge>
                    </div>

                    {/* Top Right - Actions */}
                    <div className="absolute top-5 right-5 flex gap-2">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(blog.id)
                        }}
                        variant="ghost" 
                        size="icon"
                        className="h-11 w-11 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ring-2 ring-white/50"
                      >
                        <Heart 
                          className={cn(
                            "h-4.5 w-4.5 transition-all duration-300",
                            likedBlogIds.includes(blog.id)
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-slate-400"
                          )}
                        />
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSave(blog.id)
                        }}
                        variant="ghost" 
                        size="icon"
                        className="h-11 w-11 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ring-2 ring-white/50"
                      >
                        <Bookmark 
                          className={cn(
                            "h-4.5 w-4.5 transition-all duration-300",
                            savedBlogIds.includes(blog.id)
                              ? "fill-blue-500 text-blue-500 scale-110"
                              : "text-slate-400"
                          )}
                        />
                      </Button>
                    </div>

                    {/* Bottom Section - Title */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-xl font-heading font-extrabold text-white leading-tight line-clamp-2 drop-shadow-2xl mb-2">{blog.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <MapPin className="h-3 w-3" />
                        <span className="font-bold drop-shadow-lg">{blog.location}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-7 flex-1 flex flex-col justify-between space-y-5">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={blog.authorImage}
                        alt={blog.author}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{blog.author}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{blog.date}</p>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 2).map(tag => (
                        <Badge 
                          key={tag}
                          variant="secondary" 
                          className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 border-none font-bold uppercase text-[9px] px-3 py-1.5 shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 2 && (
                        <Badge 
                          variant="secondary" 
                          className="rounded-xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 text-orange-600 border-none font-black uppercase text-[9px] px-3 py-1.5 shadow-sm"
                        >
                          +{blog.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="pt-5 border-t-2 border-slate-100 grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50">
                        <Eye className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="font-black text-xs text-slate-900">{(blog.views / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="text-center p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100/50">
                        <Heart className="h-4 w-4 text-red-600 mx-auto mb-1" />
                        <p className="font-black text-xs text-slate-900">{(blog.likes / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="text-center p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/50">
                        <Clock className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="font-black text-xs text-slate-900">{blog.readTime}m</p>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Button 
                      className="w-full rounded-2xl h-12 bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 font-heading font-black text-[11px] uppercase tracking-widest gap-2 shadow-xl shadow-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-95 hover:scale-105"
                    >
                      <BookOpen className="h-4 w-4" /> Read Story
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-span-full py-24 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-slate-100">
              <BookOpen className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-slate-900">No Stories Found</h3>
              <p className="text-base text-slate-500 font-medium max-w-md mx-auto">
                Try adjusting your search or filters to discover more stories
              </p>
            </div>
            <Button 
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
              className="rounded-2xl border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-pink-500/5 text-orange-600 hover:from-orange-500/10 hover:to-pink-500/10 font-heading font-black text-[11px] uppercase tracking-widest px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-orange-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {BLOGS.length}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Travel Stories</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-purple-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {(BLOGS.reduce((sum, b) => sum + b.views, 0) / 1000).toFixed(0)}K
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Total Views</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 border-slate-100/50 bg-gradient-to-br from-white to-red-50/30 shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-3xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <CardContent className="p-10 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-red-500/30 group-hover:scale-110 transition-transform duration-500">
                <Heart className="h-10 w-10 text-white fill-white" />
              </div>
              <div className="text-5xl font-heading font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                {(BLOGS.reduce((sum, b) => sum + b.likes, 0) / 1000).toFixed(0)}K
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Total Likes</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Blog Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[3rem] border-2 border-slate-100 shadow-3xl max-h-[90vh]">
          {selectedBlog && (
            <div className="overflow-y-auto max-h-[90vh] scrollbar-thin">
              {/* Hero Image */}
              <div className="relative h-[28rem] overflow-hidden">
                <img 
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Close Button */}
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-white/95 hover:bg-white shadow-2xl ring-2 ring-white/50 transition-all hover:scale-110 active:scale-90"
                >
                  <X className="h-5 w-5 text-slate-900" />
                </Button>

                {/* Title and Info on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                  <Badge className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none rounded-xl mb-4 font-black text-[11px] px-4 py-2 shadow-xl shadow-orange-500/30">
                    {selectedBlog.category}
                  </Badge>
                  <h1 className="text-5xl font-heading font-black mb-5 leading-tight drop-shadow-2xl">{selectedBlog.title}</h1>
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedBlog.authorImage}
                      alt={selectedBlog.author}
                      className="h-14 w-14 rounded-full object-cover border-3 border-white shadow-xl"
                    />
                    <div>
                      <p className="font-black text-base drop-shadow-lg">{selectedBlog.author}</p>
                      <p className="text-sm text-white/90 drop-shadow-lg">{selectedBlog.date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-10 md:p-14 bg-white space-y-8">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-base border-b-2 border-slate-100 pb-8">
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-black text-slate-900">{selectedBlog.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/50">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-black text-slate-900">{selectedBlog.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/50">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <span className="font-black text-slate-900">{selectedBlog.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-base max-w-none text-slate-700 leading-relaxed">
                  {selectedBlog.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-base font-medium mb-5 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="pt-8 border-t-2 border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Popular Tags</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBlog.tags.map(tag => (
                      <Badge 
                        key={tag}
                        className="rounded-xl bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 text-orange-600 border border-orange-500/20 font-bold uppercase text-[10px] px-4 py-2 shadow-sm hover:shadow-md transition-all hover:scale-105"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Engagement Section */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-slate-100">
                  <Button 
                    onClick={() => toggleLike(selectedBlog.id)}
                    className={cn(
                      "rounded-2xl h-14 font-heading font-black text-[11px] uppercase tracking-widest gap-2 shadow-xl transition-all duration-300 active:scale-95 hover:scale-105",
                      likedBlogIds.includes(selectedBlog.id)
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-red-500/30"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 hover:from-red-50 hover:to-pink-50 hover:text-red-600 shadow-slate-200/50"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", likedBlogIds.includes(selectedBlog.id) && "fill-current")} />
                    {likedBlogIds.includes(selectedBlog.id) ? "Liked" : "Like"}
                  </Button>
                  <Button 
                    onClick={handleComment}
                    className="rounded-2xl h-14 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-100 font-heading font-black text-[11px] uppercase tracking-widest gap-2 shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" /> Comment
                  </Button>
                  <Button 
                    onClick={() => handleShare(selectedBlog)}
                    className="rounded-2xl h-14 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 border-2 border-green-100 font-heading font-black text-[11px] uppercase tracking-widest gap-2 shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Share2 className="h-5 w-5" /> Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}