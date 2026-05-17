import {
  LayoutDashboard,
  Users,
  Tags,
  FileText,
  BookOpen,
  LogOut,
  UserCircle,
  HelpCircle,
  ClipboardCheck
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { toast } from "sonner";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/user",
    icon: Users,
  },
  {
    title: "Categories",
    url: "/admin/category",
    icon: Tags,
  },
  {
    title: "Exams",
    url: "/admin/exam",
    icon: BookOpen,
  },
  {
    title: "Questions",
    url: "/admin/question",
    icon: HelpCircle,
  },
  {
    title: "Posts",
    url: "/admin/post",
    icon: FileText,
  },
  {
    title: "Chấm Thi",
    url: "/admin/grading",
    icon: ClipboardCheck,
  },
];

export function AppSidebar() {
  const location = useLocation();
  // const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);

  const handleLogout = async () => {
    try {
      await callLogout();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <BookOpen size={24} />
          </div>
          <span>LuyenThi Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer group">
              <UserCircle className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
