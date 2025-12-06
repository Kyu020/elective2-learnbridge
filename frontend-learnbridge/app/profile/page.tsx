"use client"

import { useState } from "react"
import { Header } from "@/components/organisms/Header"
import { Sidebar } from "@/components/organisms/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { mockProgress, mockAchievements, mockBookings } from "@/lib/mock-data"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Edit,
  Save,
  Trophy,
  Target,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/ui/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate learner focused on computer science and mathematics. Always eager to expand my knowledge and skills.",
    joinDate: "January 2024",
  })

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    })
  }

  const totalHours = mockBookings.filter((b) => b.status === "completed").length * 1.5
  const completedSessions = mockBookings.filter((b) => b.status === "completed").length

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and track your progress</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" />
                      <AvatarFallback className="text-2xl">AJ</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold text-foreground">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <Badge className="mt-2" variant="secondary">
                      <Award className="mr-1 h-3 w-3" />
                      Active Learner
                    </Badge>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t pt-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Joined {profile.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Total Hours</span>
                    </div>
                    <span className="font-semibold text-foreground">{totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">Sessions</span>
                    </div>
                    <span className="font-semibold text-foreground">{completedSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-muted-foreground">Achievements</span>
                    </div>
                    <span className="font-semibold text-foreground">{mockAchievements.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-muted-foreground">Streak</span>
                    </div>
                    <span className="font-semibold text-foreground">7 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="info">
                <TabsList className="mb-6">
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="info">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleSave}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {mockProgress.map((item) => (
                        <div key={item.id}>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-foreground">{item.subject}</span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                            <span>{item.hoursSpent} hours spent</span>
                            <span>{item.sessionsCompleted} sessions completed</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockBookings
                        .filter((b) => b.status === "completed")
                        .slice(0, 5)
                        .map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                              <BookOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{booking.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.date} • {booking.duration}
                              </p>
                            </div>
                            <Badge variant="secondary">Completed</Badge>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements & Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-start gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                          >
                            <div
                              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                                achievement.unlocked ? "bg-yellow-100" : "bg-gray-100"
                              }`}
                            >
                              {achievement.icon === "trophy" && (
                                <Trophy
                                  className={`h-6 w-6 ${achievement.unlocked ? "text-yellow-600" : "text-gray-400"}`}
                                />
                              )}
                              {achievement.icon === "target" && (
                                <Target
                                  className={`h-6 w-6 ${achievement.unlocked ? "text-blue-600" : "text-gray-400"}`}
                                />
                              )}
                              {achievement.icon === "zap" && (
                                <Zap
                                  className={`h-6 w-6 ${achievement.unlocked ? "text-purple-600" : "text-gray-400"}`}
                                />
                              )}
                              {achievement.icon === "award" && (
                                <Award
                                  className={`h-6 w-6 ${achievement.unlocked ? "text-green-600" : "text-gray-400"}`}
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              {achievement.unlocked && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Unlocked {achievement.unlockedDate}
                                </p>
                              )}
                              {!achievement.unlocked && (
                                <div className="mt-2">
                                  <Progress value={achievement.progress} className="h-1" />
                                  <p className="mt-1 text-xs text-muted-foreground">{achievement.progress}% complete</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
