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
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  Truck,
  Users,
  AlertTriangle,
  BarChart3,
  MapPin,
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
  Shield,
  Crown,
  Gavel,
  Globe,
} from "lucide-react"
import { type User, ROLES } from "@/lib/rbac/types"

interface DirectorateDashboardProps {
  user: User
  onLogout: () => void
}

// Mock data for policies
const mockPolicies = [
  { id: "P001", title: "Waste Segregation Mandate", status: "active", effectiveDate: "2025-01-01", category: "Environmental" },
  { id: "P002", title: "Vehicle Emission Standards", status: "draft", effectiveDate: "2025-03-01", category: "Transport" },
  { id: "P003", title: "Residential Collection Schedule", status: "active", effectiveDate: "2024-06-01", category: "Operations" },
  { id: "P004", title: "Commercial Waste Fees", status: "under_review", effectiveDate: "2025-02-01", category: "Financial" },
]

// Mock data for strategic initiatives
const mockInitiatives = [
  { id: "I001", name: "Zero Waste by 2030", progress: 35, status: "on_track", budget: "50M ETB" },
  { id: "I002", name: "Fleet Modernization", progress: 60, status: "on_track", budget: "120M ETB" },
  { id: "I003", name: "Digital Transformation", progress: 45, status: "at_risk", budget: "30M ETB" },
  { id: "I004", name: "Recycling Infrastructure", progress: 25, status: "delayed", budget: "80M ETB" },
]

// Mock approvals waiting
const mockApprovals = [
  { id: "A001", type: "Company Registration", item: "EcoGreen Solutions Ltd.", requestedBy: "System Admin", date: "2025-01-25" },
  { id: "A002", type: "Budget Allocation", item: "Q2 Fleet Maintenance - 5M ETB", requestedBy: "Finance Dept", date: "2025-01-24" },
  { id: "A003", type: "Policy Amendment", item: "Update Collection Frequency", requestedBy: "Operations", date: "2025-01-23" },
  { id: "A004", type: "Role Assignment", item: "New IT Authority", requestedBy: "HR Dept", date: "2025-01-22" },
]

export function DirectorateDashboard({ user, onLogout }: DirectorateDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<typeof mockApprovals[0] | null>(null)

  const role = ROLES[user.roleId]

  const stats = [
    { title: "Active Policies", value: "28", change: "+2", trend: "up", icon: FileText },
    { title: "Strategic Initiatives", value: "12", change: "+1", trend: "up", icon: Globe },
    { title: "Pending Approvals", value: "8", change: "-3", trend: "down", icon: Gavel },
    { title: "Total Users", value: "156", change: "+12", trend: "up", icon: Users },
  ]

  const menuItems = [
    { id: "overview", label: "Strategic Overview", icon: BarChart3 },
    { id: "policies", label: "Policies & Rules", icon: FileText },
    { id: "approvals", label: "Approvals", icon: Gavel },
    { id: "initiatives", label: "Strategic Initiatives", icon: Globe },
    { id: "roles", label: "Role Management", icon: Shield },
    { id: "reports", label: "Executive Reports", icon: Crown },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Directorate</p>
            <p className="text-xs text-sidebar-foreground/70">Strategic Authority</p>
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
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {mockApprovals.length}
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
                        <span className="text-muted-foreground">{stat.change} from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pending Approvals */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Items requiring your authorization</CardDescription>
                  </div>
                  <Badge variant="destructive">{mockApprovals.length} Pending</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockApprovals.map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                            <Gavel className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <p className="font-medium">{approval.item}</p>
                            <p className="text-sm text-muted-foreground">
                              {approval.type} - Requested by {approval.requestedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{approval.date}</span>
                          <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strategic Initiatives Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Initiatives</CardTitle>
                  <CardDescription>Progress on major city-wide programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockInitiatives.map((initiative) => (
                      <div key={initiative.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{initiative.name}</span>
                            <Badge variant={
                              initiative.status === "on_track" ? "default" :
                              initiative.status === "at_risk" ? "secondary" : "destructive"
                            }>
                              {initiative.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">Budget: {initiative.budget}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-2 flex-1 rounded-full bg-secondary">
                            <div
                              className={`h-2 rounded-full ${
                                initiative.status === "on_track" ? "bg-primary" :
                                initiative.status === "at_risk" ? "bg-warning" : "bg-destructive"
                              }`}
                              style={{ width: `${initiative.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{initiative.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search policies..." className="pl-9" />
                </div>
                <Button onClick={() => setShowPolicyModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Policy
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Policy ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPolicies.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell className="font-mono">{policy.id}</TableCell>
                          <TableCell className="font-medium">{policy.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{policy.category}</Badge>
                          </TableCell>
                          <TableCell>{policy.effectiveDate}</TableCell>
                          <TableCell>
                            <Badge variant={
                              policy.status === "active" ? "default" :
                              policy.status === "draft" ? "secondary" : "outline"
                            }>
                              {policy.status.replace("_", " ")}
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
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Edit Policy
                                </DropdownMenuItem>
                                {policy.status === "draft" && (
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
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

          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage system roles and permissions</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(ROLES).map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <Badge variant={role.id === 1 ? "default" : "secondary"}>
                          Level {role.id}
                        </Badge>
                      </div>
                      <CardDescription>{role.level}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "approvals" || activeTab === "initiatives" || activeTab === "reports") && (
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

      {/* Create Policy Modal */}
      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Policy</DialogTitle>
            <DialogDescription>
              Define a new system-wide policy or rule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Policy Title</Label>
              <Input id="title" placeholder="Enter policy title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the policy objectives and requirements" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input id="effectiveDate" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPolicyModal(false)}>Cancel</Button>
            <Button onClick={() => setShowPolicyModal(false)}>Create Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
