import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { 
  callFetchCourses, 
  callCreateCourse, 
  callUpdateCourse, 
  callDeleteCourse, 
  callFetchCategory 
} from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Layers, 
  Crown, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Sparkles,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";

interface ICategory {
  id: string;
  name: string;
}

interface ICourse {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnail: string | null;
  isPublished: boolean;
  isPremium: boolean;
  categoryId: string | null;
  category: { name: string } | null;
  _count?: { chapters: number };
}

interface ICourseFormInput {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  isPremium: boolean;
  isPublished: boolean;
}

export const AdminCoursePage: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  
  // react-hook-form initialization
  const { register, handleSubmit, reset, setValue } = useForm<ICourseFormInput>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      thumbnail: "",
      categoryId: "",
      isPremium: false,
      isPublished: false
    }
  });

  const fetchCoursesList = async () => {
    setLoading(true);
    try {
      const res = await callFetchCourses(`searchTerm=${searchTerm}&limit=100`);
      if (res.data && res.data.data) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error("Không thể tải danh sách khoá học!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await callFetchCategory();
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCoursesList();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    reset({
      title: "",
      slug: "",
      description: "",
      thumbnail: "",
      categoryId: "",
      isPremium: false,
      isPublished: false
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course: ICourse) => {
    setEditingCourse(course);
    reset({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      categoryId: course.categoryId || "",
      isPremium: course.isPremium,
      isPublished: course.isPublished
    });
    setShowModal(true);
  };

  const handleSave = async (data: ICourseFormInput) => {
    if (!data.title.trim() || !data.slug.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và đường dẫn slug!");
      return;
    }

    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      thumbnail: data.thumbnail || null,
      categoryId: data.categoryId || null,
      isPremium: data.isPremium,
      isPublished: data.isPublished
    };

    try {
      if (editingCourse) {
        await callUpdateCourse(editingCourse.id, payload);
        toast.success("Cập nhật khoá học thành công!");
      } else {
        await callCreateCourse(payload);
        toast.success("Tạo khoá học mới thành công!");
      }
      setShowModal(false);
      fetchCoursesList();
    } catch (err: any) {
      console.error("Failed to save course:", err);
      const errMsg = err.response?.data?.message || "Có lỗi xảy ra khi lưu khoá học!";
      toast.error(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá khoá học này? Mọi chương mục và bài học liên quan sẽ bị xoá vĩnh viễn!")) {
      return;
    }

    try {
      await callDeleteCourse(id);
      toast.success("Xoá khoá học thành công!");
      fetchCoursesList();
    } catch (err) {
      console.error("Failed to delete course:", err);
      toast.error("Không thể xoá khoá học này!");
    }
  };

  const togglePublishStatus = async (course: ICourse) => {
    try {
      await callUpdateCourse(course.id, { isPublished: !course.isPublished });
      toast.success(`${course.isPublished ? 'Ẩn' : 'Xuất bản'} khoá học thành công!`);
      fetchCoursesList();
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      toast.error("Không thể thay đổi trạng thái xuất bản!");
    }
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto page-bg animate-fade-in">
      {/* Header and top stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
            Quản trị học vụ
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading mt-1 flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            Quản Lý Khoá Học
          </h1>
        </div>

        <Button onClick={handleOpenCreate} className="btn-premium rounded-xl cursor-pointer font-bold flex items-center gap-1.5 shadow-md">
          <Plus className="w-4.5 h-4.5" />
          <span>Tạo Khoá Học Mới</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card p-4 rounded-2xl border border-border/80 flex items-center gap-3 relative group">
        <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors ml-1" />
        <Input
          placeholder="Tìm kiếm tiêu đề, môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 font-semibold text-sm pl-1"
        />
      </div>

      {/* Main Table Grid */}
      {loading ? (
        <div className="py-20">
          <Loading />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto opacity-50 mb-3" />
          <h4 className="text-sm font-bold text-foreground">Chưa có khoá học nào</h4>
          <p className="text-xs text-muted-foreground mt-1">Hãy nhấp vào nút phía trên để tạo khoá học đầu tiên nhé!</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-extrabold text-muted-foreground uppercase">
                <th className="p-4">Ảnh & Tiêu Đề</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4 text-center">VIP Premium</th>
                <th className="p-4 text-center">Bài Giảng</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-semibold">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-muted/10 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 aspect-video rounded-lg overflow-hidden border bg-muted/40 flex-shrink-0">
                        <img
                          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-foreground truncate max-w-xs sm:max-w-md">
                          {course.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium font-mono truncate max-w-xs mt-0.5">
                          slug: {course.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="bg-muted px-2.5 py-1 rounded-lg border text-[10px] font-bold text-foreground">
                      {course.category?.name || "Chưa chọn"}
                    </span>
                  </td>

                  {/* Premium status */}
                  <td className="p-4 text-center">
                    {course.isPremium ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-lg border border-amber-500/20 font-extrabold text-[10px]">
                        <Crown className="w-3 h-3 fill-current" />
                        VIP
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">Miễn phí</span>
                    )}
                  </td>

                  {/* Chapter count */}
                  <td className="p-4 text-center font-bold text-foreground">
                    {course._count?.chapters || 0} chương
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => togglePublishStatus(course)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        course.isPublished
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15"
                          : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
                      }`}
                    >
                      {course.isPublished ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Đang Hiển Thị</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Bản Nháp</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/admin/course/${course.id}/syllabus`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-lg cursor-pointer font-extrabold text-[10px] text-primary border-primary/20 hover:bg-primary/5 hover:text-primary gap-1"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Giáo Trình
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(course)}
                        className="w-8 h-8 rounded-lg border-border hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center p-0"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(course.id)}
                        className="w-8 h-8 rounded-lg border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer flex items-center justify-center p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog Form */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="text-base font-black text-foreground font-heading flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                {editingCourse ? "Chỉnh Sửa Khoá Học" : "Tạo Mới Khoá Học"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-muted/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-4 text-sm font-semibold">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-bold">Tiêu đề khoá học *</label>
                <Input
                  required
                  placeholder="Ví dụ: Luyện thi THPT Quốc Gia môn Toán"
                  {...register("title", {
                    required: true,
                    onChange: (e) => {
                      const val = e.target.value;
                      // Generate slug
                      let clean = val.toLowerCase();
                      clean = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // strip accents
                      clean = clean.replace(/[đĐ]/g, 'd');
                      clean = clean.replace(/([^0-9a-z-\s])/g, ''); // strip special symbols
                      clean = clean.replace(/(\s+)/g, '-'); // replace spaces
                      clean = clean.replace(/-+/g, '-'); // collapse multiple dashes
                      clean = clean.replace(/^-+|-+$/g, ''); // trim dashes
                      setValue("slug", clean);
                    }
                  })}
                  className="rounded-xl border-border bg-background/50 focus-visible:ring-primary font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-bold">Đường dẫn slug *</label>
                <Input
                  required
                  placeholder="luyen-thi-thpt-toan"
                  {...register("slug", { required: true })}
                  className="rounded-xl border-border bg-background/50 focus-visible:ring-primary font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-bold">Ảnh bìa (Thumbnail URL)</label>
                <Input
                  placeholder="Nhập link ảnh bìa khóa học..."
                  {...register("thumbnail")}
                  className="rounded-xl border-border bg-background/50 focus-visible:ring-primary font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-bold">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  placeholder="Tóm tắt nội dung chính và mục tiêu khoá học học sinh sẽ gặt hái..."
                  {...register("description")}
                  className="w-full px-3 py-2 text-xs font-semibold bg-background/50 border border-border rounded-xl focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-offset-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-bold">Môn học / Danh mục</label>
                  <select
                    {...register("categoryId")}
                    className="w-full h-10 px-3 text-xs font-semibold bg-background/50 border border-border rounded-xl focus:outline-hidden focus:border-primary cursor-pointer"
                  >
                    <option value="">-- Chọn môn học --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end space-y-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-foreground">
                    <input
                      type="checkbox"
                      {...register("isPremium")}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer accent-primary"
                    />
                    <span>Khóa học Premium VIP</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-foreground">
                    <input
                      type="checkbox"
                      {...register("isPublished")}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer accent-primary"
                    />
                    <span>Xuất bản ngay</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border-border font-bold text-xs"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="btn-premium rounded-xl font-extrabold text-xs shadow-md"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Lưu thông tin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
