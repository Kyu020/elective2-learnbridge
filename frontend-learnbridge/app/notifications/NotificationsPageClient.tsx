"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockNotifications } from "@/lib/mock-data"
import { Bell, Calendar, BookOpen, Award, Clock, Check, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NotificationsPageClient() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "session":
        return <Calendar className="h-5 w-5 text-blue-600" />
      case "resource":
        return <BookOpen className="h-5 w-5 text-green-600" />
      case "achievement":
        return <Award className="h-5 w-5 text-yellow-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const NotificationCard = ({ notification }: { notification: (typeof notifications)[0] }) => (
    <Card className={`transition-all ${!notification.read ? "border-l-4 border-l-blue-600 bg-blue-50/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h4 className="font-semibold text-foreground">{notification.title}</h4>
              {!notification.read && <Badge variant="secondary">New</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
          </div>
          <div className="flex flex-col gap-2">
            {!notification.read && (
              <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)} title="Mark as read">
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNotification(notification.id)}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <LayoutWrapper>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="session">Sessions</TabsTrigger>
          <TabsTrigger value="resource">Resources</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No notifications</h3>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications.filter((n) => !n.read).length > 0 ? (
            notifications
              .filter((n) => !n.read)
              .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="mb-4 h-12 w-12 text-green-600" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No unread notifications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          {notifications.filter((n) => n.type === "session").length > 0 ? (
            notifications
              .filter((n) => n.type === "session")
              .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No session notifications</h3>
                <p className="text-sm text-muted-foreground">Session updates will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resource" className="space-y-4">
          {notifications.filter((n) => n.type === "resource").length > 0 ? (
            notifications
              .filter((n) => n.type === "resource")
              .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No resource notifications</h3>
                <p className="text-sm text-muted-foreground">Resource updates will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievement" className="space-y-4">
          {notifications.filter((n) => n.type === "achievement").length > 0 ? (
            notifications
              .filter((n) => n.type === "achievement")
              .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No achievement notifications</h3>
                <p className="text-sm text-muted-foreground">Achievement updates will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}

