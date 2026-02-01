import { useState, useEffect, useRef } from "react"

import { useNavigate, useLocation } from "react-router-dom"

import { 

  Send, 

   

  ArrowLeft, 

  MoreVertical, 

  Phone, 



  Compass,

  

  Clock,

  Wifi,

  WifiOff,

} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"

import { cn } from "@/lib/utils"

import { useAuthStore } from "@/store/authStore"



export default function ChatPage() {

  const navigate = useNavigate()

  const location = useLocation()

  const scrollRef = useRef<HTMLDivElement>(null)

  const wsRef = useRef<WebSocket | null>(null)



  const { userProfile } = useAuthStore()



  // 🔐 Auth

  const authToken = useAuthStore(state => state.token)

  const currentUserId = (userProfile as any)?.userId || 

                        (userProfile as any)?.id || 

                        (userProfile as any)?.email



  // 🔥 Realtime-only state

  const [activePartnerId, setActivePartnerId] = useState<string | null>(null)

  const [messages, setMessages] = useState<any[]>([])

  const [messageText, setMessageText] = useState("")

  const [wsConnected, setWsConnected] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")



  // =========================

  // Set Partner from Navigation

  // =========================

  useEffect(() => {

    if (location.state?.partnerId) {

      setActivePartnerId(location.state.partnerId)

      setMessages([]) // clear when switching partner

    }

  }, [location.state])



  // =========================

  // WebSocket Connection

  // =========================

  useEffect(() => {

    if (!authToken || !currentUserId) {

      console.log("❌ No token or userId")

      return

    }



    const ws = new WebSocket(`wss://tarvelmate-1.onrender.com/ws/chat?token=${authToken}`)

    wsRef.current = ws



    ws.onopen = () => {

      console.log("✅ WebSocket Connected")

      setWsConnected(true)

    }



    ws.onmessage = (event) => {

      const data = JSON.parse(event.data)

      console.log("📩 WS Message:", data)



      // Skip if this message is from me (already added optimistically)

      if (data.from === currentUserId) {

        console.log("⏭️ Skipping own message (already in UI)")

        return

      }



      setMessages(prev => [

        ...prev,

        {

          id: Date.now().toString(),

          senderId: data.from,

          content: data.message,

          createdAt: new Date().toISOString()

        }

      ])

    }



    ws.onerror = (err) => {

      console.error("❌ WS Error", err)

    }



    ws.onclose = () => {

      console.log("🔌 WebSocket Disconnected")

      setWsConnected(false)

    }



    return () => {

      ws.close()

    }

  }, [authToken, currentUserId])



  // =========================

  // Auto Scroll

  // =========================

  useEffect(() => {

    if (scrollRef.current) {

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight

    }

  }, [messages])



  // =========================

  // Send Message (Realtime)

  // =========================

  const handleSendMessage = () => {

    if (!messageText.trim() || !activePartnerId || !wsRef.current) {

      return

    }



    if (wsRef.current.readyState !== WebSocket.OPEN) {

      alert("WebSocket not connected")

      return

    }



    const payload = {

      to: activePartnerId,

      message: messageText

    }



    wsRef.current.send(JSON.stringify(payload))



    // Optimistic UI - add message immediately

    setMessages(prev => [

      ...prev,

      {

        id: Date.now().toString(),

        senderId: currentUserId,

        content: messageText,

        createdAt: new Date().toISOString()

      }

    ])



    setMessageText("")

  }



  const activeConversation = activePartnerId



  return (

    <div className="flex h-screen bg-[#F8FAFC] font-body overflow-hidden">

      {/* Sidebar (Simplified) */}

      <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-100 flex flex-col z-20 shadow-xl shadow-slate-200/20">

        <div className="p-6 space-y-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2.5">

              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 relative">

                <Compass className="h-5 w-5 text-white" />

                <div className={cn(

                  "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white",

                  wsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"

                )} />

              </div>

              <h1 className="text-xl font-heading font-black tracking-tight text-slate-900 uppercase">Messages</h1>

            </div>

            <Button 

              variant="ghost" 

              size="icon" 

              onClick={() => navigate("/home")}

            >

              <ArrowLeft className="h-5 w-5" />

            </Button>

          </div>



          <input 

            type="text"

            placeholder="Search..."

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            className="w-full h-12 bg-slate-50 rounded-2xl px-4"

          />



          <div className={cn(

            "rounded-xl p-3 flex items-center gap-2",

            wsConnected ? "bg-green-50" : "bg-amber-50"

          )}>

            {wsConnected ? (

              <>

                <Wifi className="h-4 w-4 text-green-600" />

                <span className="text-xs font-bold">Connected</span>

              </>

            ) : (

              <>

                <WifiOff className="h-4 w-4 text-amber-600" />

                <span className="text-xs font-bold">Connecting...</span>

              </>

            )}

          </div>

        </div>



        <div className="flex-1 overflow-y-auto px-3 space-y-2">

          {activePartnerId ? (

            <button className="w-full p-4 rounded-2xl bg-primary text-white font-black">

              Chat with {activePartnerId}

            </button>

          ) : (

            <div className="text-center text-slate-400 text-sm p-6">

              Open a chat from Home

            </div>

          )}

        </div>



        <div className="p-6 bg-slate-50/50">

          <Card className="p-4 flex items-center gap-3">

            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center font-black">

              {userProfile?.name?.[0] || "U"}

            </div>

            <div>

              <p className="text-sm font-black">{userProfile?.name || "User"}</p>

              <p className="text-xs text-slate-400">

                {wsConnected ? "🟢 Online" : "🔴 Offline"}

              </p>

            </div>

          </Card>

        </div>

      </aside>



      {/* Main Chat Area */}

      <main className="flex-1 flex flex-col h-full bg-white">

        {activeConversation ? (

          <>

            {/* Header */}

            <header className="h-24 border-b flex items-center justify-between px-8">

              <h3 className="text-lg font-black">

                Chat with {activePartnerId}

              </h3>

              <div className="flex items-center gap-2">

                <Phone className="h-5 w-5 text-slate-400" />

                <MoreVertical className="h-5 w-5 text-slate-400" />

              </div>

            </header>



            {/* Messages */}

            <div 

              ref={scrollRef}

              className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]"

            >

              {messages.length > 0 ? messages.map((msg, i) => {

                const isMine = msg.senderId === currentUserId

                return (

                  <div 

                    key={msg.id || i}

                    className={cn("flex", isMine ? "justify-end" : "justify-start")}

                  >

                    <div className={cn(

                      "p-4 rounded-2xl max-w-[60%]",

                      isMine ? "bg-primary text-white" : "bg-white"

                    )}>

                      {msg.content}

                    </div>

                  </div>

                )

              }) : (

                <div className="h-full flex flex-col items-center justify-center text-slate-400">

                  <Clock className="h-10 w-10 mb-4" />

                  <p>No messages yet. Say hello 👋</p>

                </div>

              )}

            </div>



            {/* Input */}

            <footer className="p-6 border-t flex gap-3">

              <input

                type="text"

                placeholder={wsConnected ? "Type a message..." : "Connecting..."}

                value={messageText}

                onChange={(e) => setMessageText(e.target.value)}

                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}

                disabled={!wsConnected}

                className="flex-1 h-14 bg-slate-50 rounded-2xl px-4"

              />

              <Button 

                onClick={handleSendMessage}

                disabled={!messageText.trim() || !wsConnected}

              >

                <Send className="h-5 w-5" />

              </Button>

            </footer>

          </>

        ) : (

          <div className="h-full flex items-center justify-center text-slate-400">

            Select a user to start chatting

          </div>

        )}

      </main>

    </div>

  )

}
