"use client"

import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Award, BookOpen, Target, Calendar, CheckCircle2 } from "lucide-react"

export function ProgressPageClient() {
  const learningGoals = [
    { id: 1, title: "Complete Data Structures Course", progress: 75, target: 100, unit: "lessons" },
    { id: 2, title: "Master Python Programming", progress: 45, target: 60, unit: "hours" },
    { id: 3, title: "Linear Algebra Proficiency", progress: 30, target: 40, unit: "exercises" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "session",
      title: "Completed session with Michael Chen",
      date: "2 hours ago",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "resource",
      title: "Started Data Structures & Algorithms",
      date: "1 day ago",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "achievement",
      title: "Earned 'Quick Learner' badge",
      date: "2 days ago",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      id: 4,
      type: "session",
      title: "Completed session with Sarah Johnson",
      date: "3 days ago",
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ]

  const weeklyStats = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4.0 },
    { day: "Fri", hours: 2.0 },
    { day: "Sat", hours: 3.5 },
    { day: "Sun", hours: 2.5 },
  ]

  const maxHours = Math.max(...weeklyStats.map((s) => s.hours))

  return (
    <LayoutWrapper>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Learning Progress</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Study Time</p>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">156h</p>
            <p className="text-xs text-green-600 mt-1">+12h this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completed Sessions</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-xs text-green-600 mt-1">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Resources Completed</p>
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">18</p>
            <p className="text-xs text-muted-foreground mt-1">75% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Achievements</p>
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground mt-1">8 more to unlock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Learning Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {learningGoals.map((goal) => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{goal.title}</p>
                  <span className="text-sm text-muted-foreground">
                    {goal.progress}/{goal.target} {goal.unit}
                  </span>
                </div>
                <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((goal.progress / goal.target) * 100)}% complete
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {weeklyStats.map((stat) => (
                <div key={stat.day} className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-muted rounded-t-lg relative" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all"
                      style={{ height: `${(stat.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.day}</span>
                  <span className="text-xs font-medium">{stat.hours}h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0 ${activity.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </LayoutWrapper>
  )
}

