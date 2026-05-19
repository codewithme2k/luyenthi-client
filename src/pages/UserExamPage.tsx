import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategory } from "@/redux/slice/categorySlice";
import { fetchExam } from "@/redux/slice/examSlice";
import { toast } from "sonner";
import type { IExam } from "@/types/backend";

// Modular Sub-components
import { ExamHero } from "@/components/Client/Exams/ExamHero";
import { ExamFilter } from "@/components/Client/Exams/ExamFilter";
import { ExamGrid } from "@/components/Client/Exams/ExamGrid";
import { ExamPagination } from "@/components/Client/Exams/ExamPagination";
import { StartExamModal } from "@/components/Client/Exams/StartExamModal";
import { UpgradeModal } from "@/components/Client/Exams/UpgradeModal";

const UserExamPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: exams, isFetching: isExamsFetching, meta: examsMeta } = useAppSelector((state) => state.exam);
  const { data: categories, isFetching: isCategoriesFetching } = useAppSelector((state) => state.category);
  const { isAuthenticated, user } = useAppSelector((state) => state.account);

  // States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Sync debounced search value with the URL param changes
  useEffect(() => {
    setDebouncedSearch(searchTerm);
  }, [searchTerm]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6; // Beautiful 3x2 grid

  // Selected Exam for Preview Modal
  const [previewExam, setPreviewExam] = useState<IExam | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchCategory({ query: "limit=100" }));
  }, [dispatch]);

  // Load exams when filters change
  useEffect(() => {
    let query = `page=${page}&limit=${limit}&isPublished=true`;
    if (debouncedSearch.trim() !== "") {
      query += `&searchTerm=${encodeURIComponent(debouncedSearch.trim())}`;
    }
    if (selectedCategoryId) {
      query += `&categoryId=${selectedCategoryId}`;
    }
    dispatch(fetchExam({ query }));
  }, [dispatch, page, debouncedSearch, selectedCategoryId]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  const handleStartExam = (exam: IExam) => {
    if (exam.isPremium) {
      if (!isAuthenticated) {
        toast.error("Bạn cần đăng nhập để làm đề thi Premium!");
        navigate("/login");
        return;
      }

      const isPremiumUser = user?.isPremium === true;
      const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

      if (!isPremiumUser && !isAdminOrManager) {
        setShowUpgradeModal(true);
        return;
      }
    }
    setPreviewExam(exam);
  };

  const confirmStartExam = () => {
    if (!previewExam) return;
    toast.success(`Đang tải đề thi "${previewExam.title}"... Chúc bạn làm bài đạt kết quả tốt!`);
    navigate(`/exam/${previewExam.slug}`);
    setPreviewExam(null);
  };

  const totalPages = Math.ceil((examsMeta?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-background pb-16 page-bg">
      {/* Dynamic Glowing Top Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header / Hero Section */}
      <ExamHero />

      {/* Floating Search & Category Filter Panel */}
      <ExamFilter 
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          if (val) {
            setSearchParams({ searchTerm: val });
          } else {
            setSearchParams({});
          }
        }}
        categories={categories}
        isCategoriesFetching={isCategoriesFetching}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content: Exam Grid */}
      <ExamGrid 
        exams={exams}
        isExamsFetching={isExamsFetching}
        limit={limit}
        totalExams={examsMeta?.total || 0}
        onResetFilters={() => {
          setSearchParams({});
          setSelectedCategoryId(null);
        }}
        onStartExam={handleStartExam}
      />

      {/* Pagination */}
      <ExamPagination 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Start Exam Preview Dialog */}
      {previewExam && (
        <StartExamModal 
          exam={previewExam}
          onClose={() => setPreviewExam(null)}
          onConfirm={confirmStartExam}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal 
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            setShowUpgradeModal(false);
            navigate("/premium");
          }}
        />
      )}
    </div>
  );
};

export default UserExamPage;
