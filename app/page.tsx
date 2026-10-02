"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { LoginModal } from "@/components/auth/login-modal"
import { SignupModal } from "@/components/auth/signup-modal"
import { CentralAuthorityEntry } from "@/components/central-authority/central-authority-entry"
import { WasteCompanyDashboard } from "@/components/dashboards/waste-company-dashboard"
import { ResidentPortal } from "@/components/dashboards/resident-portal"

export type UserRole = "central-authority" | "waste-company" | "resident" | null
export type AuthModal = "login" | "signup" | null

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; name: string } | null>(null)
  const [authModal, setAuthModal] = useState<AuthModal>(null)

  const handleLogin = (role: UserRole, name: string) => {
    setCurrentUser({ role, name })
    setAuthModal(null)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (currentUser) {
    switch (currentUser.role) {
      case "central-authority":
        // Central Authority now uses role-based access control (RBAC)
        // Users are automatically routed to their dashboard based on role_id
        return <CentralAuthorityEntry onBack={handleLogout} />
      case "waste-company":
        return <WasteCompanyDashboard user={currentUser} onLogout={handleLogout} />
      case "resident":
        return <ResidentPortal user={currentUser} onLogout={handleLogout} />
      default:
        return <LandingPage onOpenLogin={() => setAuthModal("login")} onOpenSignup={() => setAuthModal("signup")} />
    }
  }

  return (
    <>
      <LandingPage onOpenLogin={() => setAuthModal("login")} onOpenSignup={() => setAuthModal("signup")} />
      <LoginModal 
        open={authModal === "login"} 
        onClose={() => setAuthModal(null)} 
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthModal("signup")}
      />
      <SignupModal 
        open={authModal === "signup"} 
        onClose={() => setAuthModal(null)} 
        onSignup={handleLogin}
        onSwitchToLogin={() => setAuthModal("login")}
      />
    </>
  )
}
