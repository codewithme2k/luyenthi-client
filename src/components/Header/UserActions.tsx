import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLogoutAction } from "@/redux/slice/accountSlice";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  ChevronDown, 
  ShieldCheck 
} from "lucide-react";
import { toast } from "sonner";

export const UserActions: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.account);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(setLogoutAction());
    toast.success("Đã đăng xuất thành công!");
    navigate("/");
    setDropdownOpen(false);
  };

  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
    const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBackendUrl}${cleanUrl}`;
  };

  if (isAuthenticated) {
    return (
      <div className="relative z-50">
        {/* User Dropdown Trigger */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background/50 hover:bg-muted/50 transition-all duration-300 font-semibold text-sm cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
            {user?.profileImg ? (
              <img src={getImageUrl(user.profileImg)} alt="Avatar" className="w-full h-full object-cover" />
            ) : isAdminOrManager ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <span className="max-w-[100px] truncate text-foreground">
            {user?.name || user?.email || "Người dùng"}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <>
            {/* Click-away Overlay backdrop */}
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={() => setDropdownOpen(false)}
            />
            
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-popover p-2 shadow-2xl z-50 animate-fade-in font-medium text-sm">
              <div className="px-3 py-2 border-b border-border mb-1 text-xs text-muted-foreground">
                Đăng nhập với vai trò:<br />
                <span className="font-bold text-foreground text-xs uppercase text-primary">
                  {user?.role || "USER"}
                </span>
              </div>

              {isAdminOrManager && (
                <Link
                  to="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Trang Quản Trị</span>
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-semibold"
              >
                <User className="w-4 h-4" />
                <span>Hồ Sơ Cá Nhân</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-foreground font-semibold cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Not authenticated
  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="ghost" className="h-10 rounded-xl font-bold cursor-pointer hover:bg-muted text-foreground">
          Đăng Nhập
        </Button>
      </Link>
      <Link to="/register">
        <Button className="btn-premium h-10 px-4 rounded-xl font-bold cursor-pointer">
          Đăng Ký
        </Button>
      </Link>
    </div>
  );
};
