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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BarChart3,
  Bell,
  Search,
  MoreHorizontal,
  Plus,
  CheckCircle,
  XCircle,
  Settings,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  FileText,
  Building2,
  Database,
  UserPlus,
  Edit,
  Trash2,
  Key,
  Cog,
} from "lucide-react"
import { type User, ROLES } from "@/lib/rbac/types"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

// Mock users data
const mockSystemUsers = [
  { id: "U001", name: "Abebe Kebede", email: "abebe@company.com", role: "Driver", company: "Green Solutions", status: "active", lastLogin: "2025-01-25" },
  { id: "U002", name: "Sara Mekonnen", email: "sara@company.com", role: "Manager", company: "EcoWaste Corp", status: "active", lastLogin: "2025-01-25" },
  { id: "U003", name: "Dawit Haile", email: "dawit@company.com", role: "Operator", company: "City Cleaners", status: "inactive", lastLogin: "2025-01-20" },
  { id: "U004", name: "Tigist Assefa", email: "tigist@resident.com", role: "Resident", company: "-", status: "active", lastLogin: "2025-01-24" },
  { id: "U005", name: "Yohannes Bekele", email: "yohannes@company.com", role: "Driver", company: "Addis Waste Mgmt", status: "active", lastLogin: "2025-01-25" },
]

// Mock system data
const mockSystemData = [
  { id: "D001", table: "waste_collections", records: 15420, lastUpdated: "2025-01-25 14:30" },
  { id: "D002", table: "complaints", records: 2340, lastUpdated: "2025-01-25 14:28" },
  { id: "D003", table: "vehicles", records: 320, lastUpdated: "2025-01-25 12:00" },
  { id: "D004", table: "zones", records: 11, lastUpdated: "2025-01-24 09:00" },
  { id: "D005", table: "companies", records: 24, lastUpdated: "2025-01-23 16:45" },
]

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<typeof mockSystemUsers[0] | null>(null)

  const role = ROLES[user.roleId]

  const stats = [
    { title: "Total Users", value: "1,247", change: "+23", trend: "up", icon: Users },
    { title: "Active Sessions", value: "89", change: "+12", trend: "up", icon: Key },
    { title: "Data Records", value: "18.2K", change: "+450", trend: "up", icon: Database },
    { title: "Pending Tasks", value: "34", change: "-8", trend: "down", icon: FileText },
  ]

  const menuItems = [
    { id: "overview", label: "Operations Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "data", label: "Data Management", icon: Database },
    { id: "companies", label: "Company Data", icon: Building2 },
    { id: "support", label: "Support Tasks", icon: Settings },
    { id: "settings", label: "System Config", icon: Cog },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Cog className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">System Admin</p>
            <p className="text-xs text-sidebar-foreground/70">Operations</p>
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
                placeholder="Search users, data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                3
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
                        <span className="text-muted-foreground">{stat.change} today</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setActiveTab("users")}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Add New User</p>
                      <p className="text-sm text-muted-foreground">Create user accounts</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setActiveTab("data")}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Manage Data</p>
                      <p className="text-sm text-muted-foreground">Update system records</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Generate Report</p>
                      <p className="text-sm text-muted-foreground">Create operational reports</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                  <CardDescription>Users who logged in recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemUsers.slice(0, 5).map((sysUser) => (
                        <TableRow key={sysUser.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{sysUser.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{sysUser.name}</p>
                                <p className="text-xs text-muted-foreground">{sysUser.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{sysUser.role}</TableCell>
                          <TableCell>{sysUser.company}</TableCell>
                          <TableCell>{sysUser.lastLogin}</TableCell>
                          <TableCell>
                            <Badge variant={sysUser.status === "active" ? "default" : "secondary"}>
                              {sysUser.status}
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

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9" />
                </div>
                <Button onClick={() => setShowUserModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemUsers.map((sysUser) => (
                        <TableRow key={sysUser.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{sysUser.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{sysUser.name}</p>
                                <p className="text-xs text-muted-foreground">{sysUser.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{sysUser.role}</Badge>
                          </TableCell>
                          <TableCell>{sysUser.company}</TableCell>
                          <TableCell>
                            <Badge variant={sysUser.status === "active" ? "default" : "secondary"}>
                              {sysUser.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{sysUser.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Data Tables</CardTitle>
                  <CardDescription>Overview of data managed in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table Name</TableHead>
                        <TableHead>Total Records</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemData.map((data) => (
                        <TableRow key={data.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Database className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono">{data.table}</span>
                            </div>
                          </TableCell>
                          <TableCell>{data.records.toLocaleString()}</TableCell>
                          <TableCell>{data.lastUpdated}</TableCell>
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

          {(activeTab === "companies" || activeTab === "support" || activeTab === "settings") && (
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

      {/* Add User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="manager">Company Manager</SelectItem>
                  <SelectItem value="resident">Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (if applicable)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">Green Solutions Ltd</SelectItem>
                  <SelectItem value="eco">EcoWaste Corp</SelectItem>
                  <SelectItem value="city">City Cleaners</SelectItem>
                  <SelectItem value="addis">Addis Waste Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>Cancel</Button>
            <Button onClick={() => setShowUserModal(false)}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
