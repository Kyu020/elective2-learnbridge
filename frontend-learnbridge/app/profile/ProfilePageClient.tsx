// app/profile/ProfilePageClient.tsx
"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/authContext"
import { useToast } from "@/hooks/ui/use-toast"

// Lazy load heavy components
const Textarea = dynamic(() => import("@/components/ui/textarea").then(mod => ({ default: mod.Textarea })), {
  ssr: false
})

interface ProfilePageClientProps {
  initialUser?: any
}

export function ProfilePageClient({ initialUser }: ProfilePageClientProps) {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    program: "",
    specialization: "",
    learningInterests: "",
    learningLevel: "",
    preferredMode: ""
  })

  const displayUser = user || initialUser

  useEffect(() => {
    if (displayUser) {
      setFormData({
        username: displayUser.username || "",
        program: displayUser.program || "",
        specialization: displayUser.specialization || "",
        learningInterests: Array.isArray(displayUser.learningInterests) 
          ? displayUser.learningInterests.join(", ") 
          : displayUser.learningInterests || "",
        learningLevel: displayUser.learningLevel || "",
        preferredMode: displayUser.preferredMode || ""
      })
    }
  }, [displayUser])

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Implement profile update API call
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
      setEditing(false)
      await refreshUser()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!displayUser) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your profile information and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={displayUser.profilePicture?.url} alt={displayUser.username} />
              <AvatarFallback className="text-2xl">
                {displayUser.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" disabled>
              Change Picture
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant={editing ? "outline" : "default"}
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
            >
              {editing ? (loading ? "Saving..." : "Save") : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={displayUser.studentId || ""}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={displayUser.email || ""}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!editing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                disabled={!editing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                disabled={!editing}
                className="mt-1"
              />
            </div>

            {editing && (
              <>
                <div>
                  <Label htmlFor="learningInterests">Learning Interests</Label>
                  <Input
                    id="learningInterests"
                    value={formData.learningInterests}
                    onChange={(e) => setFormData({ ...formData, learningInterests: e.target.value })}
                    placeholder="e.g., Programming, Mathematics"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="learningLevel">Learning Level</Label>
                  <Input
                    id="learningLevel"
                    value={formData.learningLevel}
                    onChange={(e) => setFormData({ ...formData, learningLevel: e.target.value })}
                    placeholder="e.g., Beginner, Intermediate"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredMode">Preferred Mode</Label>
                  <Input
                    id="preferredMode"
                    value={formData.preferredMode}
                    onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
                    placeholder="e.g., Online, In-person"
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  )
}

