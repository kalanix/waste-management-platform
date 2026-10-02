"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Recycle,
  Package,
  MapPin,
  Bell,
  Clock,
  LogOut,
  Settings,
  Menu,
  ChevronDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  FileText,
  Truck,
  Calendar,
  History,
  User,
  Phone,
  Mail,
  Home,
  MessageSquare,
  XCircle,
  Loader2,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface ResidentPortalProps {
  user: { role: string; name: string }
  onLogout: () => void
}

// Mock data
const mockRequests = [
  { 
    id: "REQ001", 
    wasteType: "General", 
    quantity: "5 bags", 
    preferredDate: "2025-01-26", 
    preferredTime: "Morning",
    status: "in-progress", 
    createdAt: "2025-01-25",
    assignedVehicle: "AA-12345",
    driver: "Kebede Alemu",
    estimatedArrival: "10:30 AM"
  },
  { 
    id: "REQ002", 
    wasteType: "Recyclable", 
    quantity: "3 bags", 
    preferredDate: "2025-01-27", 
    preferredTime: "Afternoon",
    status: "pending", 
    createdAt: "2025-01-25",
    assignedVehicle: null,
    driver: null,
    estimatedArrival: null
  },
  { 
    id: "REQ003", 
    wasteType: "General", 
    quantity: "4 bags", 
    preferredDate: "2025-01-23", 
    preferredTime: "Morning",
    status: "completed", 
    createdAt: "2025-01-22",
    assignedVehicle: "AA-23456",
    driver: "Tadesse Bekele",
    completedAt: "2025-01-23 09:45 AM"
  },
  { 
    id: "REQ004", 
    wasteType: "Hazardous", 
    quantity: "2 items", 
    preferredDate: "2025-01-20", 
    preferredTime: "Morning",
    status: "completed", 
    createdAt: "2025-01-18",
    assignedVehicle: "AA-34567",
    driver: "Girma Tesfaye",
    completedAt: "2025-01-20 11:30 AM"
  },
]

const mockComplaints = [
  { id: "C001", type: "Missed Collection", description: "Truck did not come on scheduled day", status: "open", date: "2025-01-24", response: null },
  { id: "C002", type: "Late Pickup", description: "Collection was 3 hours late", status: "resolved", date: "2025-01-20", response: "Apologies for the delay. Extra route assigned to your area." },
  { id: "C003", type: "Service Quality", description: "Garbage left on street after collection", status: "investigating", date: "2025-01-22", response: "We are looking into this matter." },
]

const mockNotifications = [
  { id: "N001", title: "Pickup Scheduled", message: "Your waste collection is scheduled for tomorrow morning.", time: "2 hours ago", read: false },
  { id: "N002", title: "Collection Complete", message: "Your waste has been collected successfully.", time: "1 day ago", read: true },
  { id: "N003", title: "Complaint Update", message: "Your complaint #C002 has been resolved.", time: "3 days ago", read: true },
]

export function ResidentPortal({ user, onLogout }: ResidentPortalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null)

  // Form states
  const [wasteType, setWasteType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const [complaintType, setComplaintType] = useState("")
  const [complaintDescription, setComplaintDescription] = useState("")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "requests", label: "My Requests", icon: Package },
    { id: "complaints", label: "Complaints", icon: MessageSquare },
    { id: "history", label: "Collection History", icon: History },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleNewRequest = () => {
    // Handle form submission
    setShowRequestModal(false)
    setWasteType("")
    setQuantity("")
    setPreferredDate("")
    setPreferredTime("")
  }

  const handleNewComplaint = () => {
    setShowComplaintModal(false)
    setComplaintType("")
    setComplaintDescription("")
  }

  const activeRequest = mockRequests.find(r => r.status === "in-progress")
  const pendingCount = mockRequests.filter(r => r.status === "pending").length
  const completedCount = mockRequests.filter(r => r.status === "completed").length
  const openComplaints = mockComplaints.filter(c => c.status !== "resolved").length

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        menuItems={menuItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userRole="Resident"
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
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {mockNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                      {mockNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockNotifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 py-3">
                    <div className="flex w-full items-center justify-between">
                      <span className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </span>
                      {!notification.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm text-muted-foreground">{notification.message}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setShowRequestModal(true)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold">Request Collection</h3>
                    <p className="text-sm text-muted-foreground">Schedule a waste pickup</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    if (activeRequest) {
                      setSelectedRequest(activeRequest)
                      setShowTrackingModal(true)
                    }
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold">Track Pickup</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeRequest ? "View live status" : "No active pickup"}
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setShowComplaintModal(true)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                      <AlertTriangle className="h-6 w-6 text-warning" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold">Report Issue</h3>
                    <p className="text-sm text-muted-foreground">Submit a complaint</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setActiveTab("history")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <History className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold">View History</h3>
                    <p className="text-sm text-muted-foreground">{completedCount} past collections</p>
                  </CardContent>
                </Card>
              </div>

              {/* Status Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{pendingCount}</div>
                    <p className="text-sm text-muted-foreground">Awaiting assignment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed This Month</CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{completedCount}</div>
                    <p className="text-sm text-muted-foreground">Collections completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Open Complaints</CardTitle>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{openComplaints}</div>
                    <p className="text-sm text-muted-foreground">Being processed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Collection */}
              {activeRequest && (
                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          Collection In Progress
                        </CardTitle>
                        <CardDescription>Request #{activeRequest.id}</CardDescription>
                      </div>
                      <Button onClick={() => {
                        setSelectedRequest(activeRequest)
                        setShowTrackingModal(true)
                      }}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Track Live
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Waste Type</p>
                        <p className="font-medium">{activeRequest.wasteType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{activeRequest.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Driver</p>
                        <p className="font-medium">{activeRequest.driver}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Arrival</p>
                        <p className="font-medium text-primary">{activeRequest.estimatedArrival}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Requests */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Requests</CardTitle>
                      <CardDescription>Your latest collection requests</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab("requests")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            request.status === "completed" ? "bg-green-100" :
                            request.status === "in-progress" ? "bg-primary/10" : "bg-muted"
                          }`}>
                            {request.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : request.status === "in-progress" ? (
                              <Truck className="h-5 w-5 text-primary" />
                            ) : (
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{request.wasteType} - {request.quantity}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.preferredDate} • {request.preferredTime}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          request.status === "completed" ? "secondary" :
                          request.status === "in-progress" ? "default" : "outline"
                        }>
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All Requests</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button onClick={() => setShowRequestModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </div>

              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            request.status === "completed" ? "bg-green-100" :
                            request.status === "in-progress" ? "bg-primary/10" : "bg-muted"
                          }`}>
                            {request.status === "completed" ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : request.status === "in-progress" ? (
                              <Truck className="h-6 w-6 text-primary" />
                            ) : (
                              <Clock className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Request #{request.id}</h3>
                              <Badge variant={
                                request.status === "completed" ? "secondary" :
                                request.status === "in-progress" ? "default" : "outline"
                              }>
                                {request.status}
                              </Badge>
                            </div>
                            <div className="mt-2 grid gap-2 text-sm md:grid-cols-4">
                              <div>
                                <span className="text-muted-foreground">Type: </span>
                                <span className="font-medium">{request.wasteType}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Quantity: </span>
                                <span className="font-medium">{request.quantity}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date: </span>
                                <span className="font-medium">{request.preferredDate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Time: </span>
                                <span className="font-medium">{request.preferredTime}</span>
                              </div>
                            </div>
                            {request.driver && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Assigned: </span>
                                <span className="font-medium">{request.driver} ({request.assignedVehicle})</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {request.status === "in-progress" && (
                            <Button size="sm" onClick={() => {
                              setSelectedRequest(request)
                              setShowTrackingModal(true)
                            }}>
                              <MapPin className="mr-1 h-4 w-4" />
                              Track
                            </Button>
                          )}
                          {request.status === "pending" && (
                            <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                              <XCircle className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "complaints" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button onClick={() => setShowComplaintModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Complaint
                </Button>
              </div>

              <div className="space-y-4">
                {mockComplaints.map((complaint) => (
                  <Card key={complaint.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            complaint.status === "resolved" ? "bg-green-100" :
                            complaint.status === "investigating" ? "bg-primary/10" : "bg-warning/10"
                          }`}>
                            {complaint.status === "resolved" ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <AlertTriangle className={`h-6 w-6 ${
                                complaint.status === "investigating" ? "text-primary" : "text-warning"
                              }`} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{complaint.type}</h3>
                              <Badge variant={
                                complaint.status === "resolved" ? "secondary" :
                                complaint.status === "investigating" ? "default" : "outline"
                              }>
                                {complaint.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{complaint.description}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Submitted on {complaint.date}</p>
                            {complaint.response && (
                              <div className="mt-3 rounded-lg bg-muted p-3">
                                <p className="text-sm font-medium">Response:</p>
                                <p className="text-sm text-muted-foreground">{complaint.response}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collection History</CardTitle>
                  <CardDescription>Your completed waste collections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRequests.filter(r => r.status === "completed").map((request) => (
                      <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{request.wasteType} - {request.quantity}</p>
                            <p className="text-sm text-muted-foreground">
                              Collected on {request.preferredDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{request.driver}</p>
                          <p className="text-xs text-muted-foreground">{request.assignedVehicle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-muted-foreground">Resident Account</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" defaultValue={`${user.name.toLowerCase().replace(" ", ".")}@email.com`} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue="+251 911 234 567" />
                    </div>
                    <div className="space-y-2">
                      <Label>Zone</Label>
                      <Input defaultValue="Bole" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea defaultValue="Bole Sub-city, House No. 123, Near Edna Mall" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Collection Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified before scheduled pickups</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status Updates</p>
                      <p className="text-sm text-muted-foreground">Receive updates on request status changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* New Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Waste Collection</DialogTitle>
            <DialogDescription>Submit a new collection request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Waste Type</Label>
              <Select value={wasteType} onValueChange={setWasteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Waste</SelectItem>
                  <SelectItem value="recyclable">Recyclable Materials</SelectItem>
                  <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                  <SelectItem value="organic">Organic/Compost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Number of Bags</Label>
                <Input 
                  type="number" 
                  placeholder="e.g., 5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Weight (kg)</Label>
                <Input type="number" placeholder="Optional" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Date</Label>
              <Input 
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Time</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                  <SelectItem value="evening">Evening (6PM - 9PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea placeholder="Any special instructions..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>Cancel</Button>
            <Button onClick={handleNewRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Complaint Modal */}
      <Dialog open={showComplaintModal} onOpenChange={setShowComplaintModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>Submit a complaint or report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select value={complaintType} onValueChange={setComplaintType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="missed">Missed Collection</SelectItem>
                  <SelectItem value="late">Late Pickup</SelectItem>
                  <SelectItem value="quality">Service Quality</SelectItem>
                  <SelectItem value="illegal">Illegal Dumping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe the issue in detail..."
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Related Request (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a request" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {mockRequests.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.id} - {r.wasteType} ({r.preferredDate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComplaintModal(false)}>Cancel</Button>
            <Button onClick={handleNewComplaint}>Submit Complaint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Modal */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Track Your Pickup</DialogTitle>
            <DialogDescription>
              Request #{selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Status Timeline */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Request Submitted</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.createdAt}</p>
                  </div>
                </div>
                <div className="ml-5 h-8 w-0.5 bg-green-200" />
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Driver Assigned</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.driver}</p>
                  </div>
                </div>
                <div className="ml-5 h-8 w-0.5 bg-primary" />
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">On The Way</p>
                    <p className="text-sm text-muted-foreground">Estimated arrival: {selectedRequest.estimatedArrival}</p>
                  </div>
                </div>
                <div className="ml-5 h-8 w-0.5 bg-muted" />
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Collection Complete</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <MapPin className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-2 font-medium">Live Map Tracking</p>
                <p className="text-sm text-muted-foreground">Vehicle location updates in real-time</p>
              </div>

              {/* Driver Info */}
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Your Driver</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedRequest.driver?.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedRequest.driver}</p>
                      <p className="text-sm text-muted-foreground">{selectedRequest.assignedVehicle}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="mr-1 h-4 w-4" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
