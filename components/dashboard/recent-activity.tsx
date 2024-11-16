'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "New Animal",
    description: "Max - German Shepherd was added to the shelter",
    timestamp: "2 hours ago",
    user: {
      name: "John Doe",
      avatar: "/avatars/01.png",
      initials: "JD"
    }
  },
  {
    id: 2,
    type: "Medical Check",
    description: "Luna received her annual vaccination",
    timestamp: "4 hours ago",
    user: {
      name: "Sarah Smith",
      avatar: "/avatars/02.png",
      initials: "SS"
    }
  }
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.type}</p>
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 