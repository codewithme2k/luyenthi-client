import React from "react";
import { HeroSection } from "@/components/Client/Home/HeroSection";
import { FeatureHighlights } from "@/components/Client/Home/FeatureHighlights";
import { CategoryOverview } from "@/components/Client/Home/CategoryOverview";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16 page-bg overflow-hidden relative">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <HeroSection />

      {/* Interactive Platform Highlights */}
      <FeatureHighlights />

      {/* Category Overview Section */}
      <CategoryOverview />
    </div>
  );
};

export default HomePage;
