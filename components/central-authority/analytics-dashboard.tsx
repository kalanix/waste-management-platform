"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Bell,
  Search,
  XCircle,
  Settings,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  PieChart,
  LineChart,
  Calendar,
  Layers,
  Target,
  Truck,
  MapPin,
  Users,
} from "lucide-react"
import { type User, ROLES } from "@/lib/rbac/types"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

interface AnalyticsDashboardProps {
  user: User
  onLogout: () => void
}

// Mock chart data
const collectionTrendData = [
  { month: "Jul", collections: 4200, complaints: 120 },
  { month: "Aug", collections: 4500, complaints: 105 },
  { month: "Sep", collections: 4800, complaints: 98 },
  { month: "Oct", collections: 5100, complaints: 85 },
  { month: "Nov", collections: 5400, complaints: 72 },
  { month: "Dec", collections: 5800, complaints: 65 },
  { month: "Jan", collections: 6200, complaints: 58 },
]

const wasteTypeData = [
  { name: "General", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Recyclable", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Organic", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Hazardous", value: 10, color: "hsl(var(--chart-5))" },
]

const zonePerformanceData = [
  { zone: "Bole", efficiency: 92, target: 85 },
  { zone: "Kirkos", efficiency: 88, target: 85 },
  { zone: "Yeka", efficiency: 75, target: 85 },
  { zone: "Arada", efficiency: 95, target: 85 },
  { zone: "Addis K.", efficiency: 82, target: 85 },
  { zone: "Lideta", efficiency: 68, target: 85 },
]

// Mock KPIs
const mockKPIs = [
  { id: "K001", name: "Collection Efficiency", value: "87%", target: "85%", status: "achieved", trend: "+3%" },
  { id: "K002", name: "Complaint Resolution Time", value: "2.3 days", target: "3 days", status: "achieved", trend: "-0.5 days" },
  { id: "K003", name: "Vehicle Utilization", value: "78%", target: "80%", status: "at_risk", trend: "+2%" },
  { id: "K004", name: "Recycling Rate", value: "32%", target: "35%", status: "behind", trend: "+1%" },
]

export function AnalyticsDashboard({ user, onLogout }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("30d")

  const role = ROLES[user.roleId]

  const stats = [
    { title: "Total Collections", value: "6,247", change: "+12%", trend: "up", icon: Truck },
    { title: "Active Zones", value: "11", change: "0", trend: "neutral", icon: MapPin },
    { title: "Avg. Efficiency", value: "87%", change: "+3%", trend: "up", icon: Target },
    { title: "Open Reports", value: "8", change: "-2", trend: "down", icon: FileText },
  ]

  const menuItems = [
    { id: "overview", label: "Analytics Overview", icon: PieChart },
    { id: "collections", label: "Collection Analytics", icon: BarChart3 },
    { id: "performance", label: "Performance Metrics", icon: Target },
    { id: "trends", label: "Trend Analysis", icon: LineChart },
    { id: "reports", label: "Custom Reports", icon: FileText },
    { id: "dashboards", label: "Saved Dashboards", icon: Layers },
  ]

  const chartConfig = {
    collections: {
      label: "Collections",
      color: "hsl(var(--chart-1))",
    },
    complaints: {
      label: "Complaints",
      color: "hsl(var(--chart-5))",
    },
    efficiency: {
      label: "Efficiency",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Data & Analytics</p>
            <p className="text-xs text-sidebar-foreground/70">Reporting</p>
          </div>
        </div>
        <nav className="space-y-1 p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <p>{user.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{role.name}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="flex items-center gap-1 text-sm">
                        {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                        {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-green-600" />}
                        <span className="text-muted-foreground">{stat.change} vs last period</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Collection Trend Chart */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Collection Trends</CardTitle>
                        <CardDescription>Collections vs complaints over time</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <RechartsLineChart data={collectionTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="collections" 
                          stroke="var(--color-collections)" 
                          strokeWidth={2}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="complaints" 
                          stroke="var(--color-complaints)" 
                          strokeWidth={2}
                        />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Waste Type Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Waste Type Distribution</CardTitle>
                    <CardDescription>Breakdown by waste category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={wasteTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {wasteTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {wasteTypeData.map((type) => (
                        <div key={type.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="text-sm text-muted-foreground">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Zone Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Zone Performance</CardTitle>
                  <CardDescription>Efficiency metrics by service zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={zonePerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="efficiency" fill="var(--color-efficiency)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* KPI Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Current performance against targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mockKPIs.map((kpi) => (
                      <div key={kpi.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{kpi.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold">{kpi.value}</span>
                            <span className="text-sm text-muted-foreground">/ {kpi.target}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            kpi.status === "achieved" ? "default" :
                            kpi.status === "at_risk" ? "secondary" : "destructive"
                          }>
                            {kpi.status.replace("_", " ")}
                          </Badge>
                          <p className="text-sm text-green-600 mt-1">{kpi.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === "collections" || activeTab === "performance" || activeTab === "trends" || activeTab === "reports" || activeTab === "dashboards") && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    {menuItems.find(m => m.id === activeTab)?.label}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    This section is under development.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
