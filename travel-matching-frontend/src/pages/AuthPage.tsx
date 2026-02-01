import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Compass, Palmtree, Mountain, Camera } from "lucide-react"

const TRAVEL_QUOTES = [
  { text: "Life is a journey, not a destination.", author: "Ralph Waldo Emerson" },
  { text: "Travel makes one modest. You see what a tiny place you occupy in the world.", author: "Gustave Flaubert" },
  { text: "The world is a book and those who do not travel read only one page.", author: "Saint Augustine" }
]

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
]

export default function AuthPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % TRAVEL_QUOTES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen bg-neutral-50 font-body">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-primary shadow-2xl">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div 
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentQuoteIndex ? "opacity-40 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-transparent to-black/40" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white max-w-2xl transform transition-all duration-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
              <Compass className="h-8 w-8 text-white animate-spin-slow" />
            </div>
            <span className="text-3xl font-heading font-black tracking-tight">TravelMate</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl font-heading font-extrabold leading-[1.1] animate-in fade-in slide-in-from-left-4 duration-700">
              Your next adventure <span className="text-accent underline decoration-white/30">starts here.</span>
            </h2>
            <div className="h-1 w-24 bg-accent rounded-full" />
            <blockquote className="space-y-4 pt-4">
              <p className="text-2xl font-medium tracking-tight opacity-90 leading-relaxed italic border-l-4 border-accent pl-6">
                "{TRAVEL_QUOTES[currentQuoteIndex].text}"
              </p>
              <footer className="text-lg font-semibold text-accent/90 pl-7">— {TRAVEL_QUOTES[currentQuoteIndex].author}</footer>
            </blockquote>
          </div>
          
          <div className="mt-20 flex gap-4">
            <p className="text-sm font-medium pt-2 text-white/80">Joined by 10k+ adventurers this month</p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
           {[Palmtree, Mountain, Camera].map((Icon, i) => (
             <div key={i} className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-xl hover:bg-white/20 transition-all hover:-translate-y-2 cursor-pointer">
               <Icon className="h-6 w-6 text-white" />
             </div>
           ))}
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-6 lg:w-2/5 xl:px-20 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-primary" />
              <span className="text-2xl font-heading font-black text-primary">TravelMate</span>
            </div>
          </div>

          <div className="space-y-2 mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-heading font-extrabold tracking-tight text-neutral-900 leading-tight">Welcome Back!</h1>
            <p className="text-neutral-500 font-medium">Ready for your next big trip? Log in or create an account to start matching.</p>
          </div>

          <Tabs defaultValue="login" className="w-full ">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 bg-neutral-100 rounded-[1.25rem] h-16">
              <TabsTrigger 
                value="login" 
                className="rounded-xl h-12 font-heading font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="rounded-xl h-12 font-heading font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=active]:shadow-sm transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-white p-2">
              <TabsContent value="login" className="mt-0 outline-none">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="mt-0 outline-none">
                <RegisterForm />
              </TabsContent>
            </div>
          </Tabs>

          <p className="mt-8 text-center text-xs text-neutral-400 font-medium">
            By joining, you agree to our{" "}
            <a href="#" className="underline decoration-neutral-200 underline-offset-4 hover:text-primary transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline decoration-neutral-200 underline-offset-4 hover:text-primary transition-colors">
              Privacy Rules
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
