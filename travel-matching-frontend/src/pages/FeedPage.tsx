import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, Compass,  Eye, UserCheck, ArrowLeft,
  Sparkles, Info,  Heart, CheckCircle2, Loader2, MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useMatchesStore } from "@/store/matchesStore"

// Define the interface to match your Backend DTO exactly
interface MatchProfile {
  userId: string;       // CHANGED: was 'id'
  name: string;
  matchScore: number;
  percentage: number;
  // Optional fields (Backend doesn't send these yet, so we make them optional)
  profilePhoto?: string; 
  age?: number;
  gender?: string;
  hometown?: string;
  bio?: string;
  interests?: string[];
  status?: string;
  preferred_travel_companion_gender?: string;
}

export default function FeedPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // const [searchQuery, setSearchQuery] = useState("")
  const [selectedPartner, setSelectedPartner] = useState<MatchProfile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sendingMatch, setSendingMatch] = useState<string | null>(null)
  const [sentMatches, setSentMatches] = useState<string[]>([])

  const { 
    searchResults, // Renamed for clarity 
    isLoadingSearch: isLoading, 
    searchError: error,
    findMatches,
    sendMatchRequest 
  } = useMatchesStore()

  // Cast the store results to our typed interface
  const partners = searchResults as MatchProfile[]

  const handleSendMatch = async (receiverId: string) => {
    setSendingMatch(receiverId)
    try {
      await sendMatchRequest(receiverId)
      setSentMatches(prev => [...prev, receiverId])
    } catch (err: any) {
      console.error("Error sending match:", err)
    } finally {
      setSendingMatch(null)
    }
  }

  const lastSearchRef = useRef<string | null>(null);

  useEffect(() => {
    const currentStateString = JSON.stringify(location.state);
    if (location.state && currentStateString !== lastSearchRef.current) {
      findMatches(location.state)
      lastSearchRef.current = currentStateString;
    }
  }, [location.state, findMatches])

  const handleViewProfile = (partner: MatchProfile) => {
    setSelectedPartner(partner)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body selection:bg-primary selection:text-white pb-24">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/home")}
                className="rounded-xl hover:bg-slate-50 text-slate-400 hover:text-primary transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-black tracking-tight text-slate-900 uppercase">
                 Travel Feed
              </h1>
            </div>
          </div>
          {/* ... Search input remains same ... */}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Matched Companions <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">{partners.length}</span>
            </h2>
            <p className="text-slate-400 font-medium mt-1">Found based on your destination and preferences.</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-bold flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => location.state && findMatches(location.state)} className="text-red-600 hover:bg-red-100">Retry</Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-[2.5rem] bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.length > 0 ? partners.map((partner) => (
            <Card key={partner.userId} className="group rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full">
              
              {/* IMAGE SECTION */}
              <div className="relative h-64 overflow-hidden">
                {/* SAFEGUARD: Use placeholder if image is missing */}
                <img 
                  src={partner.profilePhoto || "https://github.com/shadcn.png"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={partner.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-md text-primary font-black rounded-lg border-none shadow-lg text-[10px]">
                    {partner.percentage}% Match
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                   <div className="flex items-center gap-2">
                     <h3 className="text-xl font-heading font-extrabold text-white leading-tight">{partner.name}</h3>
                     {/* SAFEGUARD: Default status */}
                     <div className={`h-2 w-2 rounded-full ring-4 ring-white/20 ${partner.status === "Online" ? 'bg-green-400' : 'bg-slate-400'}`} />
                   </div>
                   <div className="flex items-center gap-2 text-white/80 mt-1">
                      {/* SAFEGUARD: Default Gender/Age */}
                      <span className="text-xs font-bold uppercase tracking-widest">{partner.gender || "Traveler"}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs font-bold uppercase tracking-widest">{partner.age ? `${partner.age} YEARS` : "N/A"}</span>
                   </div>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {/* SAFEGUARD: Default Hometown */}
                    <span className="text-[11px] font-black uppercase tracking-wider leading-none">{partner.hometown || "Global Citizen"}</span>
                  </div>

                  <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-2">
                    "{partner.bio || "Ready for a new adventure!"}"
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {/* SAFEGUARD: Check if interests exist before mapping */}
                    {partner.interests ? partner.interests.map((interest: string) => (
                      <Badge key={interest} variant="secondary" className="rounded-lg bg-slate-50 text-slate-500 border-none font-bold uppercase text-[8px] px-2 py-0.5">
                        {interest}
                      </Badge>
                    )) : (
                       <Badge variant="secondary" className="rounded-lg bg-slate-50 text-slate-500">No tags</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewProfile(partner)}
                    className="rounded-2xl h-11 border-slate-100 bg-white hover:bg-slate-50 text-slate-600 font-heading font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400" /> View Profile
                  </Button>
                  <Button 
                    disabled={sentMatches.includes(partner.userId) || sendingMatch === partner.userId}
                    onClick={() => handleSendMatch(partner.userId)}
                    className={cn(
                      "rounded-2xl h-11 font-heading font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 group",
                      sentMatches.includes(partner.userId) 
                        ? "bg-green-500 text-white hover:bg-green-600" 
                        : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                    )}
                  >
                    {sentMatches.includes(partner.userId) ? (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Sent</>
                    ) : sendingMatch === partner.userId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <><UserCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" /> Send Match</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
               {/* Empty State remains same */}
               <div className="space-y-1">
                 <h3 className="font-heading font-black text-slate-900">No Companions Found</h3>
               </div>
            </div>
          )}
        </div>
        )}

        {/* ... Floating Action Button remains same ... */}
      </main>

      {/* Profile Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl">
          {selectedPartner && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              <div className="md:w-2/5 h-64 md:h-auto relative">
                <img 
                  src={selectedPartner.profilePhoto || "https://github.com/shadcn.png"} 
                  alt={selectedPartner.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Badge className="bg-primary/90 text-white font-black rounded-lg border-none shadow-lg text-[10px] mb-2">
                    {selectedPartner.percentage}% Match
                  </Badge>
                  <h2 className="text-3xl font-heading font-black">{selectedPartner.name}</h2>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{selectedPartner.status || "Offline"}</p>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-10 space-y-8 bg-white relative">
                {/* ... Modal Details with safeguards ... */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <Info className="h-3 w-3" /> Basic Details
                       </label>
                       <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-sm font-bold text-slate-700">{selectedPartner.age || "?"} Years • {selectedPartner.gender || "Any"}</p>
                       </div>
                    </div>
                    {/* ... */}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" /> Bio & Style
                    </label>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      "{selectedPartner.bio || "No bio available."}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Heart className="h-3 w-3" /> Passion & Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.interests?.map((interest: string) => (
                        <Badge key={interest} variant="secondary" className="rounded-xl bg-slate-50 text-slate-600 border border-slate-100 font-bold uppercase text-[9px] px-3 py-1.5">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button 
                    disabled={sentMatches.includes(selectedPartner.userId) || sendingMatch === selectedPartner.userId}
                    onClick={() => handleSendMatch(selectedPartner.userId)}
                    className={cn(
                      "flex-1 h-14 rounded-2xl font-heading font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
                      sentMatches.includes(selectedPartner.userId)
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20"
                        : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                    )}
                  >
                    {sentMatches.includes(selectedPartner.userId) ? (
                      <><CheckCircle2 className="h-4 w-4" /> Match Request Sent</>
                    ) : sendingMatch === selectedPartner.userId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><UserCheck className="h-4 w-4" /> Send Match Request</>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/chat", { state: { partnerId: selectedPartner.userId } })}
                    className="h-14 w-14 rounded-2xl border-slate-100 bg-white hover:bg-slate-50 text-slate-400 hover:text-primary p-0 flex items-center justify-center transition-all active:scale-95"
                  >
                    <MessageSquare className="h-6 w-6" />
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