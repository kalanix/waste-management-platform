"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Truck,
  Users,
  MapPin,
  BarChart3,
  Bell,
  Search,
  MoreHorizontal,
  Plus,
  CheckCircle,
  Clock,
  LogOut,
  Settings,
  Menu,
  ChevronDown,
  TrendingUp,
  FileText,
  Navigation,
  Calendar,
  Package,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface WasteCompanyDashboardProps {
  user: { role: string; name: string }
  onLogout: () => void
}

// Mock data
const mockVehicles = [
  { id: "V001", plateNumber: "AA-12345", type: "Compactor Truck", capacity: "8 tons", status: "active", driver: "Kebede Alemu", location: "Bole", lastUpdate: "2 min ago" },
  { id: "V002", plateNumber: "AA-23456", type: "Rear Loader", capacity: "6 tons", status: "active", driver: "Tadesse Bekele", location: "Kirkos", lastUpdate: "5 min ago" },
  { id: "V003", plateNumber: "AA-34567", type: "Compactor Truck", capacity: "8 tons", status: "maintenance", driver: null, location: "Depot", lastUpdate: "1 hour ago" },
  { id: "V004", plateNumber: "AA-45678", type: "Side Loader", capacity: "10 tons", status: "active", driver: "Girma Tesfaye", location: "Yeka", lastUpdate: "8 min ago" },
  { id: "V005", plateNumber: "AA-56789", type: "Rear Loader", capacity: "6 tons", status: "inactive", driver: null, location: "Depot", lastUpdate: "3 hours ago" },
]

const mockDrivers = [
  { id: "D001", name: "Kebede Alemu", phone: "+251 911 123 456", license: "DL-2024-001", assignedVehicle: "AA-12345", status: "on-duty", completedToday: 12 },
  { id: "D002", name: "Tadesse Bekele", phone: "+251 922 234 567", license: "DL-2024-002", assignedVehicle: "AA-23456", status: "on-duty", completedToday: 8 },
  { id: "D003", name: "Girma Tesfaye", phone: "+251 933 345 678", license: "DL-2024-003", assignedVehicle: "AA-45678", status: "on-duty", completedToday: 15 },
  { id: "D004", name: "Abebe Worku", phone: "+251 944 456 789", license: "DL-2024-004", assignedVehicle: null, status: "off-duty", completedToday: 0 },
  { id: "D005", name: "Solomon Haile", phone: "+251 955 567 890", license: "DL-2024-005", assignedVehicle: null, status: "off-duty", completedToday: 0 },
]

const mockRoutes = [
  { id: "R001", name: "Bole Morning Route", zone: "Bole", stops: 45, assignedVehicle: "AA-12345", driver: "Kebede Alemu", status: "in-progress", progress: 67 },
  { id: "R002", name: "Kirkos Route A", zone: "Kirkos", stops: 38, assignedVehicle: "AA-23456", driver: "Tadesse Bekele", status: "in-progress", progress: 42 },
  { id: "R003", name: "Yeka Industrial", zone: "Yeka", stops: 25, assignedVehicle: "AA-45678", driver: "Girma Tesfaye", status: "completed", progress: 100 },
  { id: "R004", name: "Bole Afternoon Route", zone: "Bole", stops: 50, assignedVehicle: null, driver: null, status: "scheduled", progress: 0 },
  { id: "R005", name: "Kirkos Route B", zone: "Kirkos", stops: 42, assignedVehicle: null, driver: null, status: "scheduled", progress: 0 },
]

const mockRequests = [
  { id: "REQ001", resident: "Abebe Kebede", address: "Bole, House 123", wasteType: "General", quantity: "5 bags", preferredTime: "Morning", status: "pending", date: "2025-01-26" },
  { id: "REQ002", resident: "Sara Mekonnen", address: "Kirkos, Apt 45", wasteType: "Recyclable", quantity: "3 bags", preferredTime: "Afternoon", status: "assigned", date: "2025-01-26" },
  { id: "REQ003", resident: "Dawit Haile", address: "Bole, Villa 78", wasteType: "Hazardous", quantity: "2 items", preferredTime: "Morning", status: "completed", date: "2025-01-25" },
  { id: "REQ004", resident: "Tigist Assefa", address: "Yeka, House 456", wasteType: "General", quantity: "4 bags", preferredTime: "Afternoon", status: "pending", date: "2025-01-26" },
]

export function WasteCompanyDashboard({ user, onLogout }: WasteCompanyDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "vehicles", label: "Fleet Management", icon: Truck },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "routes", label: "Routes", icon: Navigation },
    { id: "requests", label: "Collection Requests", icon: Package },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const stats = [
    { title: "Active Vehicles", value: "12", change: "+2", trend: "up", icon: Truck },
    { title: "Drivers On Duty", value: "18", change: "+3", trend: "up", icon: Users },
    { title: "Collections Today", value: "156", change: "+23", trend: "up", icon: Package },
    { title: "Pending Requests", value: "24", change: "-5", trend: "down", icon: Clock },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        menuItems={menuItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userRole="Waste Company"
        userName={user.name}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">Green Clean Services</p>
            </div>
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
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
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
                        <TrendingUp className={`h-4 w-4 ${stat.trend === "down" ? "text-green-600" : "text-green-600"}`} />
                        <span className="text-green-600">{stat.change} from yesterday</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Active Routes & Recent Activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Routes</CardTitle>
                    <CardDescription>Currently running collection routes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRoutes.filter(r => r.status === "in-progress").map((route) => (
                        <div key={route.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Navigation className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{route.name}</p>
                                <p className="text-sm text-muted-foreground">{route.driver} - {route.assignedVehicle}</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium">{route.progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div 
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${route.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{Math.round(route.stops * route.progress / 100)}/{route.stops} stops completed</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>Collection requests awaiting assignment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRequests.filter(r => r.status === "pending").map((request) => (
                        <div key={request.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                              <Package className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                              <p className="font-medium">{request.resident}</p>
                              <p className="text-sm text-muted-foreground">{request.address}</p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => setShowAssignModal(true)}>
                            Assign
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vehicle Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Status</CardTitle>
                  <CardDescription>Real-time status of all vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {mockVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={
                            vehicle.status === "active" ? "default" : 
                            vehicle.status === "maintenance" ? "secondary" : "outline"
                          }>
                            {vehicle.status}
                          </Badge>
                          <Truck className={`h-5 w-5 ${
                            vehicle.status === "active" ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <p className="font-medium">{vehicle.plateNumber}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                        {vehicle.driver && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <Users className="inline mr-1 h-3 w-3" />
                            {vehicle.driver}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          <MapPin className="inline mr-1 h-3 w-3" />
                          {vehicle.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "vehicles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search vehicles..." className="pl-9" />
                </div>
                <Button onClick={() => setShowVehicleModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                vehicle.status === "active" ? "bg-primary/10" : "bg-muted"
                              }`}>
                                <Truck className={`h-5 w-5 ${
                                  vehicle.status === "active" ? "text-primary" : "text-muted-foreground"
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium">{vehicle.plateNumber}</p>
                                <p className="text-sm text-muted-foreground">{vehicle.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell>{vehicle.capacity}</TableCell>
                          <TableCell>{vehicle.driver || <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {vehicle.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              vehicle.status === "active" ? "default" : 
                              vehicle.status === "maintenance" ? "secondary" : "outline"
                            }>
                              {vehicle.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{vehicle.lastUpdate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Track Location
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  Assign Driver
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Navigation className="mr-2 h-4 w-4" />
                                  Assign Route
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Edit Details
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

          {activeTab === "drivers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search drivers..." className="pl-9" />
                </div>
                <Button onClick={() => setShowDriverModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Driver
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>License</TableHead>
                        <TableHead>Assigned Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed Today</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDrivers.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {driver.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{driver.name}</p>
                                <p className="text-sm text-muted-foreground">{driver.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{driver.phone}</TableCell>
                          <TableCell>{driver.license}</TableCell>
                          <TableCell>
                            {driver.assignedVehicle ? (
                              <Badge variant="outline">{driver.assignedVehicle}</Badge>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={driver.status === "on-duty" ? "default" : "secondary"}>
                              {driver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {driver.completedToday} pickups
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Assign Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Navigation className="mr-2 h-4 w-4" />
                                  Assign Route
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Edit Profile
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

          {activeTab === "routes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All Routes</TabsTrigger>
                    <TabsTrigger value="active">In Progress</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Route
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockRoutes.map((route) => (
                  <Card key={route.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <Badge variant={
                          route.status === "in-progress" ? "default" : 
                          route.status === "completed" ? "secondary" : "outline"
                        }>
                          {route.status}
                        </Badge>
                      </div>
                      <CardDescription>{route.zone} Zone - {route.stops} stops</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {route.status !== "scheduled" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{route.progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div 
                              className={`h-2 rounded-full ${route.status === "completed" ? "bg-green-600" : "bg-primary"}`}
                              style={{ width: `${route.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{route.assignedVehicle || "No vehicle assigned"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{route.driver || "No driver assigned"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {route.status === "scheduled" && (
                          <Button size="sm" className="flex-1">
                            <Play className="mr-1 h-4 w-4" />
                            Start
                          </Button>
                        )}
                        {route.status === "in-progress" && (
                          <>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Pause className="mr-1 h-4 w-4" />
                              Pause
                            </Button>
                            <Button size="sm" className="flex-1">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Complete
                            </Button>
                          </>
                        )}
                        {route.status === "completed" && (
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <RotateCcw className="mr-1 h-4 w-4" />
                            Restart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search requests..." className="pl-9" />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Resident</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Waste Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Preferred Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.resident}</TableCell>
                          <TableCell>{request.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.wasteType}</Badge>
                          </TableCell>
                          <TableCell>{request.quantity}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {request.preferredTime}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              request.status === "pending" ? "secondary" : 
                              request.status === "assigned" ? "default" : "outline"
                            }>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowAssignModal(true)}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Assign to Route
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Complete
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

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Daily Summary</CardTitle>
                        <CardDescription>Today&apos;s operations</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Fleet Report</CardTitle>
                        <CardDescription>Vehicle performance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Driver Report</CardTitle>
                        <CardDescription>Driver productivity</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Navigation className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Route Analysis</CardTitle>
                        <CardDescription>Route efficiency</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Settings</CardTitle>
                  <CardDescription>Manage your company profile and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Green Clean Services" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" defaultValue="info@greenclean.et" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input defaultValue="+251 11 234 5678" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Add Vehicle Modal */}
      <Dialog open={showVehicleModal} onOpenChange={setShowVehicleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Register a new vehicle to your fleet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plate Number</Label>
              <Input placeholder="e.g., AA-12345" />
            </div>
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compactor">Compactor Truck</SelectItem>
                  <SelectItem value="rear-loader">Rear Loader</SelectItem>
                  <SelectItem value="side-loader">Side Loader</SelectItem>
                  <SelectItem value="roll-off">Roll-off Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input placeholder="e.g., 8 tons" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVehicleModal(false)}>Cancel</Button>
            <Button onClick={() => setShowVehicleModal(false)}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Driver Modal */}
      <Dialog open={showDriverModal} onOpenChange={setShowDriverModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Register a new driver to your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter driver's name" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+251 9XX XXX XXXX" />
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input placeholder="Enter license number" />
            </div>
            <div className="space-y-2">
              <Label>Assign Vehicle (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No vehicle</SelectItem>
                  {mockVehicles.filter(v => !v.driver).map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.plateNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDriverModal(false)}>Cancel</Button>
            <Button onClick={() => setShowDriverModal(false)}>Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Request Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Route</DialogTitle>
            <DialogDescription>Select a route and vehicle for this collection request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Route</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a route" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoutes.map(route => (
                    <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Vehicle</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicles.filter(v => v.status === "active").map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.plateNumber} - {v.driver}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Time</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                  <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button onClick={() => setShowAssignModal(false)}>Assign Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
