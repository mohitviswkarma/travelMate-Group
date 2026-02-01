import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import { Globe, MapPin, Camera, Upload, IndianRupee, ArrowRight, Loader2, X, Briefcase, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/authStore"

const profileSchema = z.object({
  age: z.coerce.number().min(18).max(100),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  preferredTravelCompanionGender: z.enum(["MALE", "FEMALE", "ANY"]),
  bio: z.string().min(10).max(500, {
    message: "Tell us a bit more about yourself!"
  }),
  interests: z.array(z.string()).min(1, {
    message: "Select at least one fun thing you like!"
  }),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(0),
  hometown: z.string().min(2, {
    message: "Where are you from?"
  }),
  currentOccupation: z.string().min(2, {
    message: "What do you do for a living?"
  }),
  travelLanguages: z.array(z.string()).min(1, {
    message: "What languages can you speak?"
  }),
  profilePhotoUrl: z.string().url(),
})

const LANGUAGES = [
  { label: "English", value: "ENG" },
  { label: "Hindi", value: "HINDI" },
  { label: "Spanish", value: "SPA" },
  { label: "French", value: "FRE" },
  { label: "German", value: "GER" },
  { label: "Chinese", value: "CHI" },
  { label: "Japanese", value: "JPN" },
]

type ProfileFormValues = z.infer<typeof profileSchema>

const INTERESTS = [
  { id: "TRAVEL", label: "Travel", icon: "✈️" },
  { id: "FOOD", label: "Foodie", icon: "🍜" },
  { id: "PHOTOGRAPHY", label: "Photos", icon: "📸" },
  { id: "TREKKING", label: "Trekking", icon: "🧗" },
  { id: "BEACH", label: "Beach", icon: "🏖️" },
  { id: "MOUNTAINS", label: "Mountains", icon: "🏔️" },
  { id: "CULTURE", label: "Culture", icon: "🏛️" },
  { id: "NATURE", label: "Nature", icon: "🌲" },
]

export function ProfileForm() {
  const [openLanguages, setOpenLanguages] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const navigate = useNavigate()

  // Use Zustand store
  const { userProfile, fetchUserProfile, updateUserProfile } = useAuthStore()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      age: 20,
      gender: "MALE",
      preferredTravelCompanionGender: "ANY",
      bio: "",
      interests: [],
      budgetMin: 1000,
      budgetMax: 5000,
      hometown: "",
      currentOccupation: "",
      travelLanguages: [],
      profilePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=travel",
    },
  })

  // Fetch existing profile on mount
  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  // Update form when profile is loaded
  useEffect(() => {
    if (userProfile) {
      form.reset({
        age: userProfile.age || 20,
        gender: (userProfile.gender as any) || "MALE",
        preferredTravelCompanionGender: (userProfile.preferredTravelCompanionGender as any) || "ANY",
        bio: userProfile.bio || "",
        interests: userProfile.interests || [],
        budgetMin: userProfile.budgetMin || 1000,
        budgetMax: userProfile.budgetMax || 5000,
        hometown: userProfile.hometown || "",
        currentOccupation: userProfile.currentOccupation || "",
        travelLanguages: userProfile.travelLanguages || [],
        profilePhotoUrl: userProfile.profilePhotoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=travel",
      })
      // If bio exists, assume they've been here before
      if (userProfile.bio) setIsFirstTime(false)
    }
  }, [userProfile, form])

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      await updateUserProfile(values)
      setSuccess(true)
      // No redirect needed as per user request
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-12">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <X className="h-5 w-5" /> {error}
          </div>
        )}
        {success && (
          <div className="p-6 bg-primary/5 border border-primary/20 text-primary rounded-[2rem] font-bold space-y-2 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-xl font-heading">
               <Sparkles className="h-6 w-6 text-accent" /> {isFirstTime ? "Welcome to the Journey!" : "Profile Updated Successfully!"}
            </div>
            <p className="text-sm font-medium text-slate-500">
              {isFirstTime 
                ? "Your travel profile is now ready. Let's find some amazing companions!" 
                : "We've updated your travel preferences. Your matches will be refreshed accordingly."}
            </p>
            <div className="flex gap-4 pt-2">
              <Button onClick={() => navigate("/home")} variant="default" className="bg-primary text-white hover:bg-primary/90 rounded-xl px-6">Go Home</Button>
              <Button onClick={() => setSuccess(false)} variant="ghost" className="text-slate-400 hover:text-primary rounded-xl">Dismiss</Button>
            </div>
          </div>
        )}
        <div className="space-y-8">
          <h2 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-xl text-primary">01</span> Basic Info
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control as any}
              name="age"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-bold text-neutral-700 ml-1">Your Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="rounded-2xl border-neutral-100 bg-neutral-50 focus-visible:ring-primary h-14 font-medium" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-bold text-neutral-700 ml-1">Your Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-primary h-14 font-medium">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-neutral-100 p-2">
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="preferredTravelCompanionGender"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-bold text-neutral-700 ml-1">Looking for?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-primary h-14 font-medium">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-neutral-100 p-2">
                      <SelectItem value="MALE">Male Travelers</SelectItem>
                      <SelectItem value="FEMALE">Female Travelers</SelectItem>
                      <SelectItem value="ANY">Anyone works!</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="hometown"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-bold text-neutral-700 ml-1">Hometown</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <Input placeholder="Indore, India" className="pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus-visible:ring-primary h-14 font-medium" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="currentOccupation"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                   <FormLabel className="font-bold text-neutral-700 ml-1">Current Occupation</FormLabel>
                   <FormControl>
                     <div className="relative">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                       <Input placeholder="Software Engineer" className="pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus-visible:ring-primary h-14 font-medium" {...field} />
                     </div>
                   </FormControl>
                   <FormMessage className="text-xs font-medium text-destructive ml-1" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="bg-neutral-100" />

        <div className="space-y-8">
          <h2 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-xl text-primary">02</span> Bio & Interests
          </h2>
          
          <FormField
            control={form.control as any}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-bold text-neutral-700 ml-1">About You</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your travel style, favorite snacks, or dream trips..."
                    className="rounded-3xl border-neutral-100 bg-neutral-50 focus-visible:ring-primary min-h-[150px] p-5 font-medium leading-relaxed resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-destructive ml-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="interests"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="font-bold text-neutral-700 ml-1">Your Interests</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {INTERESTS.map((interest) => (
                    <div
                      key={interest.id}
                      onClick={() => {
                        const current = field.value || []
                        const updated = current.includes(interest.id)
                          ? current.filter((id: string) => id !== interest.id)
                          : [...current, interest.id]
                        field.onChange(updated)
                      }}
                      className={cn(
                        "cursor-pointer flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 transform",
                        field.value?.includes(interest.id)
                          ? "border-primary bg-primary text-white scale-[1.02] shadow-lg shadow-primary/20"
                          : "border-neutral-100 bg-white text-neutral-400 hover:border-primary hover:bg-white"
                      )}
                    >
                      <span className="text-3xl mb-2">{interest.icon}</span>
                      <span className="text-xs font-bold font-heading uppercase tracking-wide">{interest.label}</span>
                    </div>
                  ))}
                </div>
                <FormMessage className="text-xs font-medium text-destructive ml-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-[2rem] border border-primary/10 space-y-8">
          <h2 className="text-xl font-heading font-extrabold text-primary flex items-center gap-2">
             Budget & Details
          </h2>
          
          <div className="space-y-10">
            <div className="px-2">
              <Slider
                defaultValue={[Number(form.getValues("budgetMin")), Number(form.getValues("budgetMax"))]}
                max={50000}
                step={500}
                value={[Number(form.watch("budgetMin")) || 0, Number(form.watch("budgetMax")) || 5000]}
                onValueChange={(vals) => {
                  form.setValue("budgetMin", vals[0])
                  form.setValue("budgetMax", vals[1])
                }}
                className="my-6"
              />
              <div className="flex justify-between text-xs font-bold text-neutral-400 mt-2">
                <span>₹0</span>
                <span>₹50,000+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FormField
                control={form.control as any}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-neutral-500 ml-1 uppercase tracking-widest">Min Budget</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary"/>
                        <Input 
                           type="number" 
                          className="h-12 bg-white border-neutral-100 focus-visible:ring-primary pl-10 font-bold rounded-2xl shadow-sm" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-neutral-500 ml-1 uppercase tracking-widest">Max Budget</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary"/>
                        <Input 
                          type="number" 
                          className="h-12 bg-white border-neutral-100 focus-visible:ring-primary pl-10 font-bold rounded-2xl shadow-sm" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control as any}
            name="travelLanguages"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="font-bold text-neutral-700 ml-1">Languages I speak</FormLabel>
                <Popover open={openLanguages} onOpenChange={setOpenLanguages}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full h-14 justify-between font-medium rounded-2xl bg-white border border-neutral-50 shadow-sm px-5 hover:bg-white hover:text-inherit",
                          field.value?.length === 0 && "text-neutral-400"
                        )}
                      >
                        <div className="flex gap-2 flex-wrap">
                          {field.value?.length > 0
                            ? field.value.map((val: string) => (
                                <Badge key={val} variant="secondary" className="rounded-xl bg-primary/10 text-primary border-none font-bold text-[10px] py-1 px-3 flex items-center gap-2">
                                  {val}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const updated = field.value.filter((v: string) => v !== val)
                                      field.onChange(updated)
                                    }}
                                    className="hover:text-primary/70 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                            : "Choose languages"}
                        </div>
                        <Globe className="h-4 w-4 text-primary" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-2 rounded-3xl border-neutral-100 shadow-xl" align="start">
                    <div className="space-y-1 p-2">
                      {LANGUAGES.map((lang) => (
                        <div 
                          key={lang.value} 
                          className="flex items-center space-x-3 p-3 hover:bg-neutral-50 rounded-2xl cursor-pointer group transition-colors"
                          onClick={() => {
                            const current = field.value || []
                            const isSelected = current.includes(lang.value)
                            const updated = isSelected
                              ? current.filter((v: string) => v !== lang.value)
                              : [...current, lang.value]
                            field.onChange(updated)
                          }}
                        >
                          <Checkbox
                            id={lang.value}
                            checked={field.value?.includes(lang.value)}
                            onCheckedChange={() => {}} // Controlled via parent div onClick
                            className="rounded-lg border-neutral-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label 
                            htmlFor={lang.value} 
                            className="text-sm font-bold text-neutral-600 cursor-pointer pointer-events-none"
                          >
                            {lang.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs font-medium text-destructive ml-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control as any}
          name="profilePhotoUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center space-y-6 pt-10">
              <div className="relative group">
                <div className="h-44 w-44 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-50 transition-all group-hover:scale-[1.02] transform ring-1 ring-slate-100 relative">
                  {field.value ? (
                    <img 
                      src={field.value} 
                      alt="Profile" 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300 h-full bg-slate-50">
                      <Camera className="h-10 w-10 mb-2 opacity-20" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]" onClick={() => document.getElementById("photo-upload")?.click()}>
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <Input 
                  type="file" 
                  className="hidden" 
                  id="photo-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => field.onChange(reader.result as string)
                      reader.readAsDataURL(file)
                    }
                  }}
                />
                
                <Button
                  type="button"
                  className="absolute -bottom-4 -right-4 rounded-3xl h-14 w-14 p-0 bg-accent text-white border-4 border-white shadow-xl hover:bg-accent/90 transition-all active:scale-90"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-heading font-black text-lg text-slate-800 tracking-tight">Your Travel ID Photo</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Help others recognize you on the road</p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-6 pt-10">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1 h-16 rounded-[1.5rem] text-neutral-400 font-bold hover:bg-neutral-50 transition-all font-heading"
            onClick={() => navigate("/auth")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-[2] h-16 rounded-[1.5rem] bg-primary text-white hover:bg-primary/90 font-heading font-black tracking-wide text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                Let's Explore! <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
