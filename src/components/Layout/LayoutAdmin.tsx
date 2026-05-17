import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Outlet } from "react-router"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function LayoutAdmin() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full flex flex-col min-h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-[1px] bg-border mx-2" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Management System
            </h2>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-6 bg-muted/20">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
