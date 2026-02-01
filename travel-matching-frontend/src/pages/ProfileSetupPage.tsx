import { ProfileForm } from "@/components/auth/ProfileForm"
import { Compass, MapPin } from "lucide-react"

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] py-16 px-6 font-body">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                 <Compass className="h-6 w-6 text-white animate-spin-slow" />
               </div>
               <span className="text-2xl font-heading font-black tracking-tight text-primary">
                  TravelMate
               </span>
            </div>
            <h1 className="text-5xl font-heading font-extrabold text-neutral-900 tracking-tight leading-[1.1]">
              Setup Your <span className="text-primary italic">Travel ID</span>
            </h1>
            <p className="max-w-md text-neutral-500 font-medium text-lg leading-relaxed">
              Help us find the perfect match for your next big adventure!
            </p>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-2 p-6 bg-accent/5 rounded-[2rem] border border-accent/10">
             <div className="bg-accent p-3 rounded-2xl shadow-lg shadow-accent/20">
                <MapPin className="h-6 w-6 text-white" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-accent">Indore, IN</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50 p-8 md:p-12">
            <ProfileForm />
        </div>
      </div>
    </div>
  )
}
