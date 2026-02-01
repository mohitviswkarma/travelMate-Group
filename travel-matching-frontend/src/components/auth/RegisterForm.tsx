import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react"
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
import { useNavigate } from "react-router-dom"
import { apiService } from "@/services/api"
import { useAuthStore } from "@/store/authStore"

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name should be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isOtpStep, setIsOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const navigate = useNavigate()
  const { setToken } = useAuthStore()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      // Step 1: Register user
      await apiService.register(values)

      // Step 2: Send OTP
      await apiService.sendOTP(values.email)

      setSuccessMessage("OTP sent successfully to your email!")
      setIsOtpStep(true)
    } catch (err: any) {
      setError(err.message || "Server issue. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.")
      return
    }

    setIsVerifying(true)
    setError(null)
    const email = form.getValues("email")

    try {
      const data = await apiService.verifyOTP({ email, otp })

      if ((data as any).token) {
        setToken((data as any).token)
      }
      
      setSuccessMessage("Email verified successfully!")
      setTimeout(() => navigate("/profile-setup"), 1000)
    } catch (err: any) {
      setError(err.message || "Verification failed.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm font-semibold p-4 rounded-2xl border border-destructive/20 animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 text-green-600 text-sm font-semibold p-4 rounded-2xl border border-green-100 animate-in fade-in zoom-in-95">
            {successMessage}
          </div>
        )}
        <div className="space-y-4">
          {!isOtpStep ? (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-neutral-700 ml-1">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Wanderer Name" 
                        {...field} 
                        className="rounded-2xl border-neutral-200 focus-visible:ring-accent h-14 font-medium transition-all px-5 shadow-sm placeholder:text-neutral-300" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-neutral-700 ml-1">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="you@adventure.com" 
                        {...field} 
                        className="rounded-2xl border-neutral-200 focus-visible:ring-accent h-14 font-medium transition-all px-5 shadow-sm placeholder:text-neutral-300" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-neutral-700 ml-1">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="rounded-2xl border-neutral-200 focus-visible:ring-accent h-14 font-medium transition-all px-5 shadow-sm pr-12 placeholder:text-neutral-300"
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive ml-1" />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-heading font-bold text-neutral-800">Verify Your Email</h3>
                <p className="text-sm text-neutral-500">Enter the 6-digit code we sent to your inbox.</p>
              </div>
              
              <div className="flex justify-center">
                <Input 
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="h-20 text-center text-4xl font-black tracking-[0.25em] rounded-[2rem] border-neutral-200 focus-visible:ring-primary bg-neutral-50 shadow-inner transition-all"
                />
              </div>
              
              <Button 
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.length !== 6}
                className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 font-heading font-black tracking-wide text-base transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
              >
                {isVerifying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Verify OTP <Sparkles className="h-5 w-5" />
                  </>
                )}
              </Button>
              
              <button 
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="w-full text-xs font-bold text-neutral-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                Back to Registration
              </button>
            </div>
          )}
        </div>
        
        {!isOtpStep && (
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-accent text-white hover:bg-accent/90 font-heading font-black tracking-wide text-base transition-all flex items-center justify-center gap-3 group shadow-lg shadow-accent/20"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Start Journey <Sparkles className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </>
            )}
          </Button>
        )}
      </form>
    </Form>
  )
}
