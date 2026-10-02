"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Eye,
  Shield,
  Clock,
  History,
  AlertTriangle,
  Download,
  Filter,
  ScrollText,
  FileSearch,
  Scale,
} from "lucide-react"
import { type User, ROLES } from "@/lib/rbac/types"

interface AuditDashboardProps {
  user: User
  onLogout: () => void
}

// Mock audit logs
const mockAuditLogs = [
  { id: "AL001", action: "User Login", user: "Abebe K.", role: "Driver", timestamp: "2025-01-25 15:45:23", ip: "192.168.1.45", status: "success" },
  { id: "AL002", action: "Collection Completed", user: "System", role: "System", timestamp: "2025-01-25 15:42:10", ip: "-", status: "success" },
  { id: "AL003", action: "Zone Assignment", user: "Tigist W.", role: "Supervisor", timestamp: "2025-01-25 15:38:00", ip: "192.168.1.12", status: "success" },
  { id: "AL004", action: "Failed Login Attempt", user: "Unknown", role: "-", timestamp: "2025-01-25 15:30:15", ip: "10.0.0.89", status: "failed" },
  { id: "AL005", action: "Company Approved", user: "Director", role: "Directorate", timestamp: "2025-01-25 15:25:00", ip: "192.168.1.100", status: "success" },
  { id: "AL006", action: "Report Generated", user: "Samuel G.", role: "Analytics", timestamp: "2025-01-25 15:20:45", ip: "192.168.1.55", status: "success" },
  { id: "AL007", action: "Data Export", user: "Bekele H.", role: "Admin", timestamp: "2025-01-25 15:15:30", ip: "192.168.1.33", status: "success" },
  { id: "AL008", action: "Policy Updated", user: "Director", role: "Directorate", timestamp: "2025-01-25 15:10:00", ip: "192.168.1.100", status: "success" },
]

// Mock access history
const mockAccessHistory = [
  { id: "AH001", resource: "/central-authority/directorate", user: "Dr. Alemayehu", accessTime: "2025-01-25 14:30", duration: "45 min" },
  { id: "AH002", resource: "/api/companies", user: "Tigist W.", accessTime: "2025-01-25 14:25", duration: "12 min" },
  { id: "AH003", resource: "/central-authority/admin", user: "Bekele H.", accessTime: "2025-01-25 14:15", duration: "1h 20min" },
  { id: "AH004", resource: "/api/reports/export", user: "Samuel G.", accessTime: "2025-01-25 14:00", duration: "5 min" },
]

// Mock compliance checks
const mockComplianceChecks = [
  { id: "CC001", check: "Data Retention Policy", status: "compliant", lastChecked: "2025-01-25", nextCheck: "2025-02-25" },
  { id: "CC002", check: "Access Control Review", status: "compliant", lastChecked: "2025-01-20", nextCheck: "2025-02-20" },
  { id: "CC003", check: "Password Policy Enforcement", status: "warning", lastChecked: "2025-01-15", nextCheck: "2025-01-30" },
  { id: "CC004", check: "Audit Log Integrity", status: "compliant", lastChecked: "2025-01-25", nextCheck: "2025-01-26" },
  { id: "CC005", check: "Encryption Standards", status: "compliant", lastChecked: "2025-01-10", nextCheck: "2025-02-10" },
]

export function AuditDashboard({ user, onLogout }: AuditDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [logFilter, setLogFilter] = useState("all")

  const role = ROLES[user.roleId]

  const stats = [
    { title: "Total Log Entries", value: "24,892", change: "+1,234", trend: "up", icon: ScrollText },
    { title: "Failed Actions", value: "23", change: "-5", trend: "down", icon: AlertTriangle },
    { title: "Compliance Score", value: "94%", change: "+2%", trend: "up", icon: Scale },
    { title: "Active Sessions", value: "89", change: "+12", trend: "up", icon: Eye },
  ]

  const menuItems = [
    { id: "overview", label: "Audit Overview", icon: Eye },
    { id: "logs", label: "System Logs", icon: ScrollText },
    { id: "access", label: "Access History", icon: History },
    { id: "changes", label: "Change Tracking", icon: FileSearch },
    { id: "compliance", label: "Compliance", icon: Scale },
    { id: "reports", label: "Audit Reports", icon: FileText },
  ]

  const filteredLogs = logFilter === "all" 
    ? mockAuditLogs 
    : mockAuditLogs.filter(log => log.status === logFilter)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Audit Authority</p>
            <p className="text-xs text-sidebar-foreground/70">Compliance</p>
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
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
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
                        <span className="text-muted-foreground">{stat.change} today</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Audit Logs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity Logs</CardTitle>
                      <CardDescription>Latest system activities and user actions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAuditLogs.slice(0, 6).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.role}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === "success" ? "default" : "destructive"}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Current compliance check results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockComplianceChecks.map((check) => (
                      <div key={check.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            check.status === "compliant" ? "bg-green-600/10" : "bg-warning/10"
                          }`}>
                            <Scale className={`h-5 w-5 ${
                              check.status === "compliant" ? "text-green-600" : "text-warning"
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{check.check}</p>
                            <p className="text-sm text-muted-foreground">
                              Last checked: {check.lastChecked} | Next: {check.nextCheck}
                            </p>
                          </div>
                        </div>
                        <Badge variant={check.status === "compliant" ? "default" : "secondary"}>
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-9" />
                  </div>
                  <Select value={logFilter} onValueChange={setLogFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Logs</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Log ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.id}</TableCell>
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.role}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === "success" ? "default" : "destructive"}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "access" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access History</CardTitle>
                  <CardDescription>Record of resource access by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Access Time</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAccessHistory.map((access) => (
                        <TableRow key={access.id}>
                          <TableCell>{access.user}</TableCell>
                          <TableCell className="font-mono text-sm">{access.resource}</TableCell>
                          <TableCell>{access.accessTime}</TableCell>
                          <TableCell>{access.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === "changes" || activeTab === "compliance" || activeTab === "reports") && (
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
