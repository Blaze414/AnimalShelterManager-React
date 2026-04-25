import type { ElementType } from "react";
import { PawPrint, Heart, DollarSign, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useDashboard } from "@/hooks/use-shelter-api";
import type { DashboardIcon } from "@/types/shelter";

const iconMap: Record<DashboardIcon, ElementType> = {
  paw: PawPrint,
  heart: Heart,
  dollar: DollarSign,
  users: Users,
};

const Dashboard = () => {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading dashboard...</div>;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
        {error instanceof Error ? error.message : "Failed to load dashboard."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" />
              <XAxis dataKey="month" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Bar dataKey="animals" fill="hsl(210 40% 98%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={`${activity.title}-${activity.time}`} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">{activity.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
