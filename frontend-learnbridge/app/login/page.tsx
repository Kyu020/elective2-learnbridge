"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/authContext"

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login is not yet implemented.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await api.post("/auth/login", { studentId, password });
      const { token, user: userPayload } = response.data;

      if (!token) throw new Error("Token not received");

      // Fetch full user profile from /auth/me endpoint
      try {
        const profileResponse = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const fullUserData = profileResponse.data.user || userPayload;
        
        // Transform user data to match UserProfile interface
        const userProfile = {
          _id: fullUserData.userId || fullUserData._id || "",
          username: fullUserData.username || fullUserData.name || "",
          studentId: fullUserData.studentId || "",
          email: fullUserData.email || `${studentId}@gordoncollege.edu.ph`,
          program: fullUserData.program || "",
          specialization: fullUserData.specialization || "",
          isTutor: fullUserData.isTutor || false,
          learningInterests: fullUserData.learningInterests || [],
          learningLevel: fullUserData.learningLevel || "",
          preferredMode: fullUserData.preferredMode || "",
          availability: fullUserData.availability || [],
          createdAt: fullUserData.createdAt || new Date().toISOString(),
          profilePicture: fullUserData.profilePicture,
          earnedBadges: fullUserData.earnedBadges || [],
          budgetRange: fullUserData.budgetRange
        };

        // Use auth context login function
        login(token, userProfile);
        
        if (rememberMe) {
          localStorage.setItem("studentId", studentId);
        }
        
        router.push("/dashboard");
      } catch (profileError: any) {
        // If profile fetch fails, use the payload from login
        const userProfile = {
          _id: userPayload?.userId || "",
          username: userPayload?.username || "",
          studentId: userPayload?.studentId || studentId,
          email: userPayload?.email || `${studentId}@gordoncollege.edu.ph`,
          program: userPayload?.program || "",
          specialization: userPayload?.specialization || "",
          isTutor: userPayload?.isTutor || false,
          learningInterests: [],
          learningLevel: "",
          preferredMode: "",
          availability: [],
          createdAt: new Date().toISOString(),
          profilePicture: undefined,
          earnedBadges: [],
          budgetRange: undefined
        };
        
        login(token, userProfile);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || err.response?.message || err.message || "Network error");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left side - Gradient */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white mb-6">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">L</span>
              </div>
              <span className="text-xl font-bold">LearnBridge</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Welcome back!</h1>
            <p className="text-blue-100">Continue your learning journey with expert tutors and quality resources.</p>
          </div>
          <div className="space-y-3 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
              <span>Access to 1000+ learning resources</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
              <span>Connect with expert tutors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
              <span>Track your progress</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-3/5 p-6 sm:p-8">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-600 mb-6">Enter your credentials to access your account</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="Id" className="text-sm">
                  Student ID
                </Label>
                <Input
                  id="Id"
                  type="number"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-10" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
