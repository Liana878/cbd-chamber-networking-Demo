import { Users, TrendingUp, MapPin, Activity, ChevronRight, Coffee, Handshake, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";
import { useAppState } from "../contexts/AppStateContext";

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<"overview" | "networking">("overview");
  const { adminAnalytics } = useAppState();
  const overviewStats = [
    {
      label: "Total Members",
      value: adminAnalytics.overview.totalMembers.toLocaleString(),
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Active This Week",
      value: adminAnalytics.overview.activeThisWeek.toLocaleString(),
      change: "+8%",
      icon: Activity,
      color: "bg-green-500",
    },
    {
      label: "Check-ins Today",
      value: adminAnalytics.overview.checkInsToday.toLocaleString(),
      change: "+24%",
      icon: MapPin,
      color: "bg-purple-500",
    },
    {
      label: "Completed Meetings",
      value: adminAnalytics.overview.completedMeetings.toLocaleString(),
      change: "+24%",
      icon: Target,
      color: "bg-emerald-500",
    },
  ];
  const networkingStats = [
    {
      label: "Total Invitations",
      value: adminAnalytics.networking.totalInvitations.toLocaleString(),
      change: "+28%",
      icon: Coffee,
      color: "bg-indigo-500",
    },
    {
      label: "Accepted Meetings",
      value: adminAnalytics.networking.acceptedMeetings.toLocaleString(),
      change: "+32%",
      icon: Handshake,
      color: "bg-teal-500",
    },
    {
      label: "Completed Meetings",
      value: adminAnalytics.networking.completedMeetings.toLocaleString(),
      change: "+24%",
      icon: Target,
      color: "bg-emerald-500",
    },
    {
      label: "Attendance Rate",
      value: `${adminAnalytics.networking.attendanceRate}%`,
      change: "+5%",
      icon: TrendingUp,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl mb-1">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Chamber of Commerce Analytics</p>

        {/* View Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveView("overview")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "overview"
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView("networking")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "networking"
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Networking Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {activeView === "overview" && (
        <div className="px-6 mt-6">
          <div className="grid grid-cols-2 gap-3">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-600">{stat.change}</span>
                </div>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Networking Stats Grid */}
      {activeView === "networking" && (
        <div className="px-6 mt-6">
          <div className="grid grid-cols-2 gap-3">
            {networkingStats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-600">{stat.change}</span>
                </div>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === "overview" && (
        <>
          {/* Weekly Check-ins Chart */}
          <div className="px-6 mt-6">
            <div className="bg-card rounded-xl p-4 border border-border">
              <h2 className="text-lg mb-4">Weekly Check-ins</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={adminAnalytics.weeklyCheckIns} id="weekly-checkins-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" key="grid-weekly" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#64748B" key="xaxis-weekly" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#64748B" key="yaxis-weekly" />
                  <Tooltip
                    key="tooltip-weekly"
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="checkIns" fill="#3B82F6" radius={[8, 8, 0, 0]} key="bar-weekly" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Venues */}
          <div className="px-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Top Venues</h2>
              <button className="text-sm text-primary flex items-center gap-1">
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {adminAnalytics.topVenues.map((venue, index) => (
                <div
                  key={venue.name}
                  className={`flex items-center gap-3 p-4 ${
                    index !== adminAnalytics.topVenues.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm text-primary flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{venue.name}</p>
                    <p className="text-xs text-muted-foreground">{venue.checkIns} check-ins</p>
                  </div>
                  <span className="text-xs text-green-600">{venue.change}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Networking Analytics */}
      {activeView === "networking" && (
        <>
          {/* Meeting Purposes Pie Chart */}
          <div className="px-6 mt-6">
            <div className="bg-card rounded-xl p-4 border border-border">
              <h2 className="text-lg mb-4">Meeting Purposes</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart id="meeting-purposes-chart">
                  <Pie
                    data={adminAnalytics.meetingPurposes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    key="pie-purposes"
                  >
                    {adminAnalytics.meetingPurposes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="tooltip-purposes" />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {adminAnalytics.meetingPurposes.map((purpose) => (
                  <div key={purpose.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: purpose.color }}></div>
                    <span className="text-xs text-muted-foreground">{purpose.name} ({purpose.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most Active Members */}
          <div className="px-6 mt-6">
            <h2 className="text-lg mb-4">Most Active Members</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {adminAnalytics.mostActiveMembers.map((member, index) => (
                <div
                  key={member.name}
                  className={`flex items-center gap-3 p-4 ${
                    index !== adminAnalytics.mostActiveMembers.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-sm text-secondary flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.meetings} meetings · {member.connections} connections
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="text-lg mb-4">Quick Actions</h2>
        <div className="space-y-2">
          {activeView === "overview" ? (
            <>
              <button className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="text-sm">Export Member Report</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="text-sm">Manage Venues</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="text-sm">Send Notification</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </>
          ) : (
            <button className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span className="text-sm">Export Networking Data</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
