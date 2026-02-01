import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { 
    UserPlus,
  Info,
  LogOut, 
  Search, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Globe, 
  Compass, 
  Users, 
  ArrowRight,
  Plane,
  CalendarDays,
  Check,
  X,
  User
} from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { useMatchesStore } from "@/store/matchesStore"
import { Link } from "react-router-dom"


export default function HomePage() {
  const navigate = useNavigate()
  const navItems = [
  { label: "Find Partners", path: "/home" },
  { label: "Destinations", path: "/destinations" },
  { label: "Communities", path: "/communities" },
  { label: "Stories", path: "/stories" },
]
  
  // Zustand stores
  const { userProfile, fetchUserProfile, logout } = useAuthStore()
  const { 
    matchRequests, 
    confirmedMatches, 
    isLoadingRequests, 
    isLoadingConfirmed,
    requestsError,
    fetchMatchRequests, 
    fetchConfirmedMatches,
    respondToRequest 
  } = useMatchesStore()
  
  const [destination, setDestination] = useState("")
  const [budget, setBudget] = useState([1000, 15000])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)

  // State for content switching
  const [activeTab, setActiveTab] = useState("Matches")
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRespondRequest = async (requestId: string, action: "ACCEPT" | "REJECT") => {
    try {
      await respondToRequest(requestId, action)
    } catch (err) {
      console.error("Error responding to request:", err)
    }
  }

  const handleViewProfile = (partner: any) => {
    setSelectedPartner(partner)
    setIsModalOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  useEffect(() => {
    if (activeTab === "Requests") {
      fetchMatchRequests()
    } else if (activeTab === "Matches") {
      fetchConfirmedMatches()
    }
  }, [activeTab, fetchMatchRequests, fetchConfirmedMatches])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])
  
  

  const getInitials = (name?: string) => {
    if (!name) return "TM"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }


  return (
    <div className="min-h-̀screen bg-[#F8FAFC] font-body selection:bg-primary selection:text-white pb-20">

      {/* Header */}
      <header className="z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-black tracking-tight text-primary uppercase">
               TravelMatè
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
  {navItems.map((item) => (
    <Link
      key={item.label}
      to={item.path}
      className="text-sm font-bold text-slate-500 hover:text-primary transition-all relative group"
    >
      {item.label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  ))}
</nav>

          <div className="flex items-center gap-5">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl">
              <Search className="h-5 w-5" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-100" />
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden md:block text-right">
                <p className="text-xs font-black text-slate-900 leading-none">{User.name || "Loading..."}</p>
                <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider">{userProfile?.hometown || "Traveler"}</p>
              </div>
              <div className="h-11 w-11 border-2 border-white shadow-md rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm cursor-pointer hover:scale-105 transition-transform ring-1 ring-slate-100">
                {getInitials(userProfile?.name)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-primary to-blue-400" />
              <CardContent className="relative pt-0 px-6 pb-6 text-center">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                   <div className="h-20 w-20 border-4 border-white shadow-xl rounded-3xl bg-primary flex items-center justify-center text-white text-2xl font-black group-hover:rotate-3 transition-transform">
                    {getInitials(userProfile?.name)}
                  </div>
                </div>
                <div className="pt-12">
                  <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">{userProfile?.name || "Travel Mate"}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{userProfile?.currentOccupation || "Explorer"}</p>
                  
                  {userProfile?.bio && (
                    <p className="mt-4 text-[11px] text-slate-400 font-medium italic line-clamp-3 px-2">
                      "{userProfile.bio}"
                    </p>
                  )}

                  <Button 
                    variant="outline"
                    onClick={() => navigate("/profile-setup")}
                    className="mt-6 w-full rounded-2xl border-primary/20 text-primary hover:bg-primary/5 font-heading font-black text-[10px] uppercase tracking-widest h-11"
                  >
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <nav className="flex flex-col gap-2">
              {[
                { label: "Matches", icon: Users },
                { label: "Requests", icon: UserPlus },
                { label: "Messages", icon: MessageSquare },
                { label: "Explore", icon: Globe },
                { label: "Destinations", icon: MapPin },
                { label: "Communities", icon: Users },
                { label: "Favorites", icon: Heart }
              ].map((item) => (
                <Button 
                  key={item.label}
                  variant="ghost" 
                  onClick={() => {
                    if (item.label === "Messages") navigate("/chat")
                    else if (item.label === "Destinations") navigate("/destinations")
                    else if (item.label === "Communities") navigate("/communities")
                    else setActiveTab(item.label)
                  }}
                  className={cn(
                    "w-full justify-start gap-4 h-14 px-6 rounded-2xl transition-all group",
                    activeTab === item.label ? "text-primary bg-white shadow-lg shadow-blue-500/10 font-bold" : "text-slate-400 hover:text-primary hover:bg-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", activeTab === item.label ? "text-primary" : "group-hover:text-primary")} />
                  <span className="font-heading text-sm">{item.label}</span>
                </Button>
              ))}
              <Separator className="my-4 bg-slate-100" />
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="w-full justify-start gap-4 text-slate-300 hover:text-destructive hover:bg-destructive/5 h-14 px-6 rounded-2xl transition-all font-bold"
              >
                <LogOut className="h-5 w-5" /> <span className="font-heading text-sm">Logout</span>
              </Button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === "Requests" ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Received <span className="text-primary underline decoration-accent/30 decoration-4 underline-offset-8">Requests</span></h2>
                  <p className="text-slate-400 font-medium mt-2">People who want to travel with you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requestsError && (
                    <div className="col-span-full p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-bold flex items-center justify-between">
                      <span>{requestsError}</span>
                      <Button variant="ghost" size="sm" onClick={fetchMatchRequests} className="text-red-600 hover:bg-red-100">Retry</Button>
                    </div>
                  )}
                  {isLoadingRequests ? (
                    [1, 2].map(i => (
                      <div key={i} className="h-44 rounded-[2.5rem] bg-slate-100 animate-pulse" />
                    ))
                  ) : matchRequests.length > 0 ? matchRequests.map((request) => (
                    <Card key={request.requestId} className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-md">
                            {request.senderName?.[0] || "?"}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-black text-slate-900">{request.senderName}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Sent at {new Date(request.sentAt).toLocaleDateString()}</p>
                            <div className="flex items-center gap-2 mt-2 text-primary">
                               <MessageSquare className="h-3 w-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Wants to connect</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <Button 
                            onClick={() => handleRespondRequest(request.requestId, "REJECT")}
                            variant="ghost" 
                            className="rounded-2xl h-11 bg-slate-50 text-slate-400 hover:text-destructive hover:bg-destructive/5 font-black text-[10px] uppercase tracking-widest gap-2"
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                          <Button 
                            onClick={() => handleRespondRequest(request.requestId, "ACCEPT")}
                            className="rounded-2xl h-11 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
                          >
                            <Check className="h-4 w-4" /> Accept
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                       <div className="bg-slate-100 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto">
                          <UserPlus className="h-8 w-8 text-slate-300" />
                       </div>
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending requests</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Your Travel <span className="text-primary underline decoration-accent/30 decoration-4 underline-offset-8">Soulmates</span></h2>
                    <p className="text-slate-400 font-medium mt-2">Connecting you with travelers who share your passions.</p>
                  </div>
                </div>
            

            {/* Search Section */}
            <Card className="rounded-[2.5rem] border-none bg-white shadow-2xl shadow-blue-500/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <CardContent className="p-8 md:p-10 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Plane className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-black text-slate-900 leading-none">Find Your Companion</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Tell us where you're headed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                    <div className="relative group/input">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        placeholder="Where to?" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-primary font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                      <div className="relative group/input">
                        <CalendarDays 
                          onClick={() => startDateRef.current?.showPicker()}
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-primary transition-colors cursor-pointer z-20" 
                        />
                        <Input 
                          ref={startDateRef}
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-primary font-bold text-slate-700 w-full" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                      <div className="relative group/input">
                        <CalendarDays 
                          onClick={() => endDateRef.current?.showPicker()}
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-primary transition-colors cursor-pointer z-20" 
                        />
                        <Input 
                          ref={endDateRef}
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-primary font-bold text-slate-700 w-full" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="md:col-span-2 space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Budget Range (₹)</label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary font-black px-3 py-1 rounded-lg border-none shadow-sm">
                          ₹{budget[0].toLocaleString()}
                        </Badge>
                        <span className="text-slate-300 font-black">-</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary font-black px-3 py-1 rounded-lg border-none shadow-sm">
                          ₹{budget[1].toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={50000}
                        step={500}
                        className="my-6"
                      />
                      <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span>Min: ₹0</span>
                        <span>Max: ₹50,000+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Button 
                    onClick={() => navigate("/feed", { 
                      state: { 
                        destination, 
                        startDate, 
                        endDate, 
                        minBudget: budget[0], 
                        maxBudget: budget[1] 
                      } 
                    })}
                    disabled={!destination || !startDate || !endDate}
                    className="w-full h-16 rounded-3xl bg-primary text-white hover:bg-primary/90 font-heading font-black text-lg tracking-wide shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] group flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Find the Companion <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>


            <Separator className="my-8 bg-slate-100" />

            <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
              <div>
                <h2 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Confirmed <span className="text-primary underline decoration-accent/30 decoration-4 underline-offset-8">Matches</span></h2>
                <p className="text-slate-400 font-medium mt-2">These travelers are ready to explore with you.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingConfirmed ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 animate-pulse" />
                ))
              ) : confirmedMatches.length > 0 ? confirmedMatches.map((match) => (
                <Card key={match.userId} className="group rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        {match.profilePhoto ? (
                          <img src={match.profilePhoto} className="h-24 w-24 rounded-3xl object-cover shadow-lg border-4 border-white" alt={match.name} />
                        ) : (
                          <div className="h-24 w-24 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg border-4 border-white transition-transform group-hover:rotate-3">
                            {match.name[0]}
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl border-4 border-white shadow-sm">
                           <Check className="h-3 w-3" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">{match.name}</h3>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-2 py-0.5">
                            {match.percentage}% Match
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-2 w-full grid grid-cols-2 gap-2">
                         <Button 
                          variant="ghost" 
                          onClick={() => handleViewProfile(match)}
                          className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5"
                         >
                           Profile
                         </Button>
                         <Button 
                          onClick={() => navigate("/chat", { state: { partnerId: match.userId } })}
                          className="rounded-xl h-10 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                         >
                          Chat Now
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full py-20 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <div className="bg-slate-50 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto">
                        <Users className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-black text-xl text-slate-900">No Confirmed Matches Yet</h3>
                      <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">Accept requests or find companions to start your journey together.</p>
                    </div>
                    <Button onClick={() => setActiveTab("Explore")} className="rounded-2xl h-14 px-10 bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20">Find Companions</Button>
                </div>
              )}
            </div>
            </div>
          )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-12 mt-10 relative overflow-hidden">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            <div className="md:col-span-2 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl">
                     <Compass className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-heading font-black tracking-tight text-primary uppercase">TravelMate</span>
               </div>
               <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">Find your perfect travel companion. Connecting hearts and horizons across the globe.</p>
            </div>
            <div className="space-y-6">
               <h5 className="font-heading font-bold text-slate-900">Company</h5>
               <ul className="space-y-3 text-slate-400 font-medium text-sm">
                  <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Travel Safety</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h5 className="font-heading font-bold text-slate-900">Support</h5>
               <ul className="space-y-3 text-slate-400 font-medium text-sm">
                  <li className="hover:text-primary cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
               </ul>
            </div>
         </div>
      </footer>

      {/* Profile Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl">
          {selectedPartner && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              {/* Left Side: Image */}
              <div className="md:w-2/5 h-64 md:h-auto relative">
                {selectedPartner.profilePhoto ? (
                  <img src={selectedPartner.profilePhoto} className="w-full h-full object-cover" alt={selectedPartner.name} />
                ) : (
                  <div className="h-full w-full bg-primary flex items-center justify-center text-white text-6xl font-black">
                    {selectedPartner.name?.[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Badge className="bg-primary/90 text-white font-black rounded-lg border-none shadow-lg text-[10px] mb-2">
                    {selectedPartner.percentage || 100}% Match
                  </Badge>
                  <h2 className="text-3xl font-heading font-black">{selectedPartner.name}</h2>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Matched Explorer</p>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 p-8 md:p-10 space-y-8 bg-white relative">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <Info className="h-3 w-3" /> Basic Details
                       </label>
                       <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-sm font-bold text-slate-700">{selectedPartner.age || "N/A"} Years • {selectedPartner.gender || "N/A"}</p>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <Users className="h-3 w-3" /> Preferred Companion
                       </label>
                       <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10">
                          <p className="text-sm font-bold text-primary">{selectedPartner.preferred_travel_companion_gender || "Any"}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      {/* <Sparkles className="h-3 w-3" /> Bio & Style */}
                      Bio & Style
                    </label>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      "{selectedPartner.bio || "No bio established yet."}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Heart className="h-3 w-3" /> Passion & Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.interests && selectedPartner.interests.length > 0 ? selectedPartner.interests.map((interest: string) => (
                        <Badge key={interest} variant="secondary" className="rounded-xl bg-slate-50 text-slate-600 border border-slate-100 font-bold uppercase text-[9px] px-3 py-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-default">
                          {interest}
                        </Badge>
                      )) : (
                        <p className="text-[10px] text-slate-400 italic">No interests listed.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button 
                    className="flex-1 h-14 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" /> Open Chat
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
