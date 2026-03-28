import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { apiService } from "@/services/api"
import { ArrowLeft, CalendarDays, Compass, Info, MapPin, Users } from "lucide-react"

interface GroupMember {
  userId: string
  name: string
  profilePhotoUrl?: string
  age?: number
  gender?: string
  bio?: string
  currentOccupation?: string
}

interface TravelGroupResult {
  id: string
  groupName: string
  description?: string
  destination?: string
  startDate?: string
  endDate?: string
  maxSize?: number
  currentMembersCount?: number
  interests?: string[]
  members?: GroupMember[]
}

function toNumberOrUndefined(v: string | null) {
  if (v == null || v.trim() === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export default function GroupMatchesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const criteria = useMemo(() => {
    const destination = (searchParams.get("destination") || "").trim()
    const startDate = (searchParams.get("startDate") || "").trim()
    const endDate = (searchParams.get("endDate") || "").trim()
    const minBudget = toNumberOrUndefined(searchParams.get("minBudget"))
    const maxBudget = toNumberOrUndefined(searchParams.get("maxBudget"))
    return { destination, startDate, endDate, minBudget, maxBudget }
  }, [searchParams])

  const [groups, setGroups] = useState<TravelGroupResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)

  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [selectedGroupForJoin, setSelectedGroupForJoin] = useState<TravelGroupResult | null>(null)
  const [joinMessage, setJoinMessage] = useState("Hey, I’d love to join this trip!")
  const [isSendingJoin, setIsSendingJoin] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [sentJoinRequests, setSentJoinRequests] = useState<string[]>([])

  const lastCriteriaRef = useRef<string | null>(null)

  const fetchGroups = async () => {
    if (!criteria.destination) {
      setGroups([])
      setError("Missing destination. Please go back and search again.")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = (await apiService.findGroups({ destination: criteria.destination })) as any[]
      setGroups(res as TravelGroupResult[])
    } catch (e: any) {
      setError(e?.message || "Failed to find groups")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const key = JSON.stringify(criteria)
    if (key !== lastCriteriaRef.current) {
      fetchGroups()
      lastCriteriaRef.current = key
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria])

  const usersHref = useMemo(() => {
    const params = new URLSearchParams()
    if (criteria.destination) params.set("destination", criteria.destination)
    if (criteria.startDate) params.set("startDate", criteria.startDate)
    if (criteria.endDate) params.set("endDate", criteria.endDate)
    if (criteria.minBudget != null) params.set("minBudget", String(criteria.minBudget))
    if (criteria.maxBudget != null) params.set("maxBudget", String(criteria.maxBudget))
    return `/matches/users?${params.toString()}`
  }, [criteria])

  const handleMemberClick = (m: GroupMember) => {
    setSelectedMember(m)
    setIsMemberModalOpen(true)
  }

  const openJoinDialog = (group: TravelGroupResult) => {
    setSelectedGroupForJoin(group)
    setJoinMessage("Hey, I’d love to join this trip!")
    setJoinError(null)
    setJoinDialogOpen(true)
  }

  const handleSendJoinRequest = async () => {
    if (!selectedGroupForJoin) return
    setIsSendingJoin(true)
    setJoinError(null)
    try {
      await apiService.sendGroupJoinRequest(selectedGroupForJoin.id, joinMessage || "I'd like to join this group.")
      setSentJoinRequests((prev) => [...prev, selectedGroupForJoin.id])
      setJoinDialogOpen(false)
    } catch (e: any) {
      setJoinError(e?.message || "Failed to send join request")
    } finally {
      setIsSendingJoin(false)
    }
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
              <div>
                <h1 className="text-xl font-heading font-black tracking-tight text-slate-900 uppercase">Group Matches</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Destination: <span className="text-primary">{criteria.destination || "—"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-2xl border-slate-100 bg-white hover:bg-slate-50">
              <Link to={usersHref} className="font-heading font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4" /> View Users
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Matching Groups{" "}
              <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">{groups.length}</span>
            </h2>
            <p className="text-slate-400 font-medium mt-1">Groups that match your searched destination.</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-bold flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={fetchGroups} className="text-red-600 hover:bg-red-100">
              Retry
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-[2.5rem] bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.length > 0 ? (
              groups.map((g) => (
                <Card
                  key={g.id}
                  className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
                >
                  <CardContent className="p-7 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight line-clamp-2">{g.groupName}</h3>
                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="text-[11px] font-black uppercase tracking-wider leading-none">
                            {g.destination || criteria.destination}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-none font-black rounded-xl">
                        {g.currentMembersCount ?? (g.members?.length ?? 0)}/{g.maxSize ?? "—"}
                      </Badge>
                    </div>

                    {g.description && (
                      <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-3">"{g.description}"</p>
                    )}

                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-[11px] font-black uppercase tracking-wider">
                          {g.startDate || "—"} → {g.endDate || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {g.interests?.length ? (
                        g.interests.slice(0, 6).map((it) => (
                          <Badge
                            key={it}
                            variant="secondary"
                            className="rounded-xl bg-slate-50 text-slate-600 border border-slate-100 font-bold uppercase text-[9px] px-3 py-1.5"
                          >
                            {it}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
                          No tags
                        </Badge>
                      )}
                    </div>

                    {g.members?.length ? (
                      <div className="pt-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Members</p>
                        <div className="space-y-2">
                          {g.members.slice(0, 3).map((m) => (
                            <button
                              key={m.userId}
                              type="button"
                              onClick={() => handleMemberClick(m)}
                              className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all"
                            >
                              <img
                                src={m.profilePhotoUrl || "https://github.com/shadcn.png"}
                                alt={m.name}
                                className="h-9 w-9 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate">{m.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                  {m.currentOccupation || m.gender || "Traveler"}
                                </p>
                              </div>
                              <div className="ml-auto flex items-center gap-2 text-slate-300">
                                <Info className="h-4 w-4" />
                              </div>
                            </button>
                          ))}
                          {g.members.length > 3 && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                              +{g.members.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <div className="pt-2">
                      <Button
                        disabled={sentJoinRequests.includes(g.id)}
                        onClick={() => openJoinDialog(g)}
                        className="w-full h-11 rounded-2xl bg-primary text-white font-heading font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary/20 hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                      >
                        {sentJoinRequests.includes(g.id) ? "Request Sent" : "Request to Join Group"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-slate-900">No Groups Found</h3>
                  <p className="text-slate-400 text-sm font-medium">Try another destination.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Member Profile Modal */}
      <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl">
          {selectedMember && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              {/* Left Side: Image */}
              <div className="md:w-2/5 h-64 md:h-auto relative">
                <img
                  src={selectedMember.profilePhotoUrl || "https://github.com/shadcn.png"}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-heading font-black">{selectedMember.name}</h2>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                    {selectedMember.currentOccupation || "Traveler"}
                  </p>
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
                        <p className="text-sm font-bold text-slate-700">
                          {selectedMember.age ?? "N/A"} Years • {selectedMember.gender || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="h-3 w-3" /> Occupation
                      </label>
                      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-sm font-bold text-primary">{selectedMember.currentOccupation || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Bio
                    </label>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      "{selectedMember.bio || "No bio available."}"
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Group Join Request Modal */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          {selectedGroupForJoin && (
            <div className="p-7 space-y-6">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Join Request</p>
                <h2 className="text-xl font-heading font-black text-slate-900">
                  {selectedGroupForJoin.groupName}
                </h2>
                <p className="text-xs text-slate-500">
                  This message will be sent to the group admin along with your profile.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Message
                </label>
                <Textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={4}
                  className="rounded-2xl bg-slate-50 border-slate-100 text-sm"
                  placeholder="Tell them why you’d be a great fit for this trip..."
                />
              </div>

              {joinError && (
                <p className="text-xs font-bold text-red-500">{joinError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setJoinDialogOpen(false)}
                  className="flex-1 h-11 rounded-2xl border-slate-200 text-slate-600 font-heading font-black text-[10px] uppercase tracking-widest"
                  disabled={isSendingJoin}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendJoinRequest}
                  disabled={isSendingJoin}
                  className="flex-1 h-11 rounded-2xl bg-primary text-white font-heading font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  {isSendingJoin ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

