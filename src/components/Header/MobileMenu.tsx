import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLogoutAction } from "@/redux/slice/accountSlice";
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  LogOut, 
  User, 
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAppSelector((state) => state.account);
  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  const handleLogout = () => {
    dispatch(setLogoutAction());
    toast.success("Đã đăng xuất thành công!");
    navigate("/");
    setIsOpen(false);
  };

  const links = [
    {
      name: "Trang Chủ",
      path: "/",
      icon: <Home className="w-5 h-5" />
    },
    {
      name: "Kho Đề Thi",
      path: "/exams",
      icon: <BookOpen className="w-5 h-5" />
    }
  ];

  return (
    <div className="md:hidden">
      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl border border-border flex items-center justify-center bg-background/50 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Body Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-border p-6 shadow-2xl z-50 flex flex-col justify-between animate-slide-in">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="font-extrabold font-heading text-primary text-base">
                  Menu Điều Hướng
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Vertical Navigation Links */}
              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = currentPath === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions Area (Auth Options) */}
            <div className="border-t border-border pt-6 mt-6 space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* Logged In Info */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      {isAdminOrManager ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-semibold uppercase leading-none">
                        {user.role}
                      </p>
                      <p className="text-sm font-bold truncate text-foreground leading-snug mt-1">
                        {user.name || user.email}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {isAdminOrManager && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-bold text-sm border"
                    >
                      <LayoutDashboard className="w-4.5 h-4.5" />
                      <span>Trang Quản Trị</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-foreground font-bold text-sm border cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Not Logged In Buttons */}
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full h-11 rounded-xl font-bold cursor-pointer border-border">
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                    <Button className="btn-premium w-full h-11 rounded-xl font-bold cursor-pointer">
                      Đăng Ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
