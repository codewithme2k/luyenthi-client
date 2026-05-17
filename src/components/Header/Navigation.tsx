import React from "react";
import { Link, useLocation } from "react-router";
import { BookOpen, Home } from "lucide-react";

export const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    {
      name: "Trang Chủ",
      path: "/",
      icon: <Home className="w-4 h-4" />
    },
    {
      name: "Kho Đề Thi",
      path: "/exams",
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map((link) => {
        const isActive = currentPath === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
              isActive
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
