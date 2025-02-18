'use client'

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeamSpaceList } from "@/components/dashboard/TeamSpaceList"
import { CreateDialog } from "@/components/dashboard/CreateDialog"
import { logOut } from "@/lib/auth"
import { SidebarProvider } from "@/contexts/SidebarContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-notion-default">
        {/* Sidebar */}
        <aside className="w-64 bg-notion-sidebar flex flex-col h-screen">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-notion-text-primary">Team Spaces</h2>
              <Button
                onClick={() => {}} // Will be handled by CreateDialog
                size="icon"
                variant="ghost"
                className="text-notion-text-primary hover:bg-notion-hover"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <TeamSpaceList />
          </div>

          {/* User section */}
          <div className="p-4 border-t border-notion-text-secondary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-notion-text-secondary truncate">
                {user?.email}
              </span>
              <Button
                onClick={handleLogout}
                size="icon"
                variant="ghost"
                className="text-notion-text-primary hover:bg-notion-hover"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Dialogs */}
        <CreateDialog />
      </div>
    </SidebarProvider>
  )
} 