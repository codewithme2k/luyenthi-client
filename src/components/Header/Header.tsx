import React from "react";
import { Brand } from "./Brand";
import { Navigation } from "./Navigation";
import { SearchInput } from "./SearchInput";
import { UserActions } from "./UserActions";
import { MobileMenu } from "./MobileMenu";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-40 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand/Logo - Left */}
        <div className="flex items-center gap-6">
          <Brand />
          
          {/* Desktop Navigation Links */}
          <Navigation />
        </div>

        {/* Search & Actions - Right */}
        <div className="flex items-center gap-3">
          {/* Quick Search Input */}
          <SearchInput />

          {/* User Auth Buttons / Profile Menu */}
          <UserActions />

          {/* Mobile Drawer Menu Toggle */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
export default Header;
