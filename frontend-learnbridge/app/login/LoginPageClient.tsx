// app/login/LoginPageClient.tsx
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

export function LoginPageClient() {
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
        
        // Store token in cookie for middleware
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
        
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
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your LearnBridge account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("Google")}
                className="w-full"
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("Facebook")}
                className="w-full"
              >
                Facebook
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

