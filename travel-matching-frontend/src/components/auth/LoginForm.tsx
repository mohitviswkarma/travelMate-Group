import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react"
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

const loginSchema = z.object({
  email: z.string().email({
    message: "Oops! That doesn't look like a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password needs to be at least 6 characters.",
  }),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtpStep, setIsOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const navigate = useNavigate()
  const { setToken } = useAuthStore()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const data = await apiService.login(values)

      if ((data as any).verificationRequired) {
        setIsOtpStep(true)
        return
      }

      if ((data as any).token) {
        setToken((data as any).token)
      }
      navigate("/home")
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again!")
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
      
      navigate("/profile-setup")
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
        <div className="space-y-4">
          {!isOtpStep ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-neutral-700 ml-1">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="adventure@travelmate.com" 
                        {...field} 
                        className="rounded-2xl border-neutral-200 focus-visible:ring-primary h-14 font-medium transition-all px-5 shadow-sm" 
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
                    <div className="flex items-center justify-between ml-1">
                      <FormLabel className="text-sm font-bold text-neutral-700">Password</FormLabel>
                      <button 
                        type="button" 
                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="rounded-2xl border-neutral-200 focus-visible:ring-primary h-14 font-medium transition-all px-5 shadow-sm pr-12"
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
                <h3 className="text-lg font-heading font-bold text-neutral-800">Verify Your Identity</h3>
                <p className="text-sm text-neutral-500">Your email isn't verified yet. We've sent a 6-digit code to your inbox.</p>
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
                    Verify & Login <Sparkles className="h-5 w-5" />
                  </>
                )}
              </Button>
              
              <button 
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="w-full text-xs font-bold text-neutral-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
        
        {!isOtpStep && (
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 font-heading font-black tracking-wide text-base transition-all flex items-center justify-center gap-3 group shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Let's Go! <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        )}
      </form>
    </Form>
  )
}
