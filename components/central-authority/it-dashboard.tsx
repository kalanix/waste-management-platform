"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  CheckCircle,
  XCircle,
  Settings,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Wifi,
  Shield,
  HardDrive,
  Activity,
  AlertTriangle,
  RefreshCw,
  Download,
  Terminal,
  Monitor,
} from "lucide-react"
import { type User, ROLES } from "@/lib/rbac/types"

interface ITDashboardProps {
  user: User
  onLogout: () => void
}

// Mock server status
const mockServers = [
  { id: "S001", name: "Production Web Server", status: "healthy", cpu: 45, memory: 62, uptime: "99.98%", location: "Primary DC" },
  { id: "S002", name: "Database Server", status: "healthy", cpu: 38, memory: 71, uptime: "99.99%", location: "Primary DC" },
  { id: "S003", name: "API Gateway", status: "warning", cpu: 78, memory: 85, uptime: "99.95%", location: "Primary DC" },
  { id: "S004", name: "Backup Server", status: "healthy", cpu: 12, memory: 34, uptime: "99.97%", location: "Secondary DC" },
  { id: "S005", name: "Analytics Server", status: "healthy", cpu: 55, memory: 48, uptime: "99.90%", location: "Secondary DC" },
]

// Mock recent backups
const mockBackups = [
  { id: "B001", type: "Full Backup", size: "125 GB", status: "completed", timestamp: "2025-01-25 02:00" },
  { id: "B002", type: "Incremental", size: "8.5 GB", status: "completed", timestamp: "2025-01-25 08:00" },
  { id: "B003", type: "Incremental", size: "12.3 GB", status: "completed", timestamp: "2025-01-25 14:00" },
  { id: "B004", type: "Full Backup", size: "128 GB", status: "in_progress", timestamp: "2025-01-26 02:00" },
]

// Mock security events
const mockSecurityEvents = [
  { id: "SE001", event: "Failed login attempt", ip: "192.168.1.45", severity: "medium", timestamp: "2025-01-25 15:30" },
  { id: "SE002", event: "SSL certificate renewal", ip: "-", severity: "low", timestamp: "2025-01-25 12:00" },
  { id: "SE003", event: "Firewall rule updated", ip: "-", severity: "low", timestamp: "2025-01-24 18:45" },
  { id: "SE004", event: "Multiple failed logins", ip: "10.0.0.89", severity: "high", timestamp: "2025-01-24 14:20" },
]

export function ITDashboard({ user, onLogout }: ITDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const role = ROLES[user.roleId]

  const stats = [
    { title: "System Uptime", value: "99.97%", change: "+0.02%", trend: "up", icon: Activity },
    { title: "Active Servers", value: "5/5", change: "Healthy", trend: "up", icon: Server },
    { title: "Storage Used", value: "2.4 TB", change: "68%", trend: "neutral", icon: HardDrive },
    { title: "Security Alerts", value: "3", change: "-2", trend: "down", icon: Shield },
  ]

  const menuItems = [
    { id: "overview", label: "System Overview", icon: Monitor },
    { id: "servers", label: "Server Status", icon: Server },
    { id: "database", label: "Database", icon: Database },
    { id: "backups", label: "Backups", icon: HardDrive },
    { id: "security", label: "Security", icon: Shield },
    { id: "network", label: "Network", icon: Wifi },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">IT Authority</p>
            <p className="text-xs text-sidebar-foreground/70">Infrastructure</p>
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
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-xs text-warning-foreground">
                {mockSecurityEvents.filter(e => e.severity === "high").length}
              </span>
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
                        <span className="text-muted-foreground">{stat.change}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Server Status Grid */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Server Status</CardTitle>
                      <CardDescription>Real-time server health monitoring</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockServers.map((server) => (
                      <div key={server.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Server className={`h-4 w-4 ${
                              server.status === "healthy" ? "text-green-600" : "text-warning"
                            }`} />
                            <span className="font-medium text-sm">{server.name}</span>
                          </div>
                          <Badge variant={server.status === "healthy" ? "default" : "secondary"}>
                            {server.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">CPU</span>
                              <span>{server.cpu}%</span>
                            </div>
                            <Progress value={server.cpu} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Memory</span>
                              <span>{server.memory}%</span>
                            </div>
                            <Progress value={server.memory} className="h-2" />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                            <span>Uptime: {server.uptime}</span>
                            <span>{server.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Backups & Security Events */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Backups</CardTitle>
                    <CardDescription>Automated backup status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockBackups.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              backup.status === "completed" ? "bg-green-600/10" : "bg-primary/10"
                            }`}>
                              {backup.status === "completed" ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{backup.type}</p>
                              <p className="text-sm text-muted-foreground">{backup.timestamp}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{backup.size}</p>
                            <Badge variant={backup.status === "completed" ? "outline" : "secondary"}>
                              {backup.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Events</CardTitle>
                    <CardDescription>Recent security-related activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSecurityEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              event.severity === "high" ? "bg-destructive/10" :
                              event.severity === "medium" ? "bg-warning/10" : "bg-muted"
                            }`}>
                              <Shield className={`h-5 w-5 ${
                                event.severity === "high" ? "text-destructive" :
                                event.severity === "medium" ? "text-warning" : "text-muted-foreground"
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">{event.event}</p>
                              <p className="text-sm text-muted-foreground">
                                {event.ip !== "-" ? `IP: ${event.ip}` : event.timestamp}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            event.severity === "high" ? "destructive" :
                            event.severity === "medium" ? "secondary" : "outline"
                          }>
                            {event.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "servers" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Servers</CardTitle>
                  <CardDescription>Detailed server information and controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Server</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>CPU</TableHead>
                        <TableHead>Memory</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockServers.map((server) => (
                        <TableRow key={server.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Server className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{server.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={server.status === "healthy" ? "default" : "secondary"}>
                              {server.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="w-20">
                              <Progress value={server.cpu} className="h-2" />
                              <span className="text-xs text-muted-foreground">{server.cpu}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-20">
                              <Progress value={server.memory} className="h-2" />
                              <span className="text-xs text-muted-foreground">{server.memory}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{server.uptime}</TableCell>
                          <TableCell>{server.location}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === "database" || activeTab === "backups" || activeTab === "security" || activeTab === "network") && (
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
