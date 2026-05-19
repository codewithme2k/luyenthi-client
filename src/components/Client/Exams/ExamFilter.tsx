import React from "react";
import { Search, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ICategory } from "@/types/backend";

interface ExamFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: ICategory[];
  isCategoriesFetching: boolean;
  selectedCategoryId: string | null;
  onCategorySelect: (id: string | null) => void;
}

export const ExamFilter: React.FC<ExamFilterProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  isCategoriesFetching,
  selectedCategoryId,
  onCategorySelect,
}) => {
  return (
    <section className="container mx-auto px-6 max-w-7xl mb-10">
      <div className="glass p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
        {/* Search Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đề thi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-background/50 border-input focus-visible:ring-primary rounded-xl"
          />
        </div>

        {/* Category Chips Scroll Container */}
        <div className="w-full overflow-x-auto flex gap-2 py-1 scrollbar-thin select-none">
          {/* All Categories Chip */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 shrink-0 border cursor-pointer ${
              selectedCategoryId === null
                ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(139,92,246,0.3)] scale-[1.02]"
                : "bg-background/40 hover:bg-muted border-border text-muted-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tất cả</span>
          </button>

          {/* Dynamic Category Chips */}
          {isCategoriesFetching ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shrink-0 border cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(139,92,246,0.3)] scale-[1.02]"
                    : "bg-background/40 hover:bg-muted border-border text-muted-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
