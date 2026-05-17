import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { callFetchMySessions, callUpdateProfile, callUploadFile } from "@/config/api";
import { updateAccount } from "@/redux/slice/accountSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, History, Save, Camera } from "lucide-react";
import Loading from "@/components/Layout/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.account.user);
  const dispatch = useDispatch();

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(user?.profileImg || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
    const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBackendUrl}${cleanUrl}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh quá nặng! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Đang tải ảnh đại diện lên...");
    try {
      const res = await callUploadFile(formData);
      if (res.data?.success) {
        const imageUrl = res.data.data.url;
        setProfileImg(imageUrl);
        toast.success("Tải ảnh lên thành công!", { id: toastId });
      } else {
        toast.error("Tải ảnh thất bại!", { id: toastId });
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối với máy chủ upload!", { id: toastId });
    }
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || "",
      contactNo: user?.contactNo || "",
      address: user?.address || "",
      gender: user?.gender || "male",
    }
  });

  useEffect(() => {
    fetchMySessions();
    if (user) {
      setValue("name", user.name || "");
      setValue("contactNo", user.contactNo || "");
      setValue("address", user.address || "");
      setValue("gender", user.gender || "male");
      setProfileImg(user.profileImg || null);
    }
  }, [user, setValue]);

  const fetchMySessions = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await callFetchMySessions();
      if (res.data?.success) {
        setSessions(res.data.data);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách lịch sử thi.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    const payload = { ...data, profileImg };
    try {
      const res = await callUpdateProfile(payload);
      if (res.data?.success) {
        toast.success("Cập nhật thông tin thành công!");
        // Update local Redux state
        dispatch(updateAccount({ user: { ...user, ...payload } }));
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user || !user.id) {
    return <Loading />;
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Hồ Sơ Cá Nhân</h1>
        <p className="text-muted-foreground mt-2">Quản lý thông tin tài khoản và xem lịch sử các bài thi bạn đã hoàn thành.</p>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="history" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="w-4 h-4" /> Lịch sử thi
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="w-4 h-4" /> Thông tin cá nhân
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="animate-fade-in outline-none">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {isLoadingHistory ? (
              <div className="py-20"><Loading /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="py-4">Đề thi</TableHead>
                    <TableHead>Thời gian nộp bài</TableHead>
                    <TableHead className="text-right">Điểm số</TableHead>
                    <TableHead className="text-center">Kết quả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-semibold text-foreground py-4">
                          {session.exam?.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(session.createdAt).toLocaleString('vi-VN')}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary text-lg">
                          {Math.round(session.score * 10) / 10}
                          <span className="text-xs text-muted-foreground font-normal ml-1">/ {session.exam?.totalMarks}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {session.score >= session.exam?.passMarks ? (
                            <span className="text-xs px-3 py-1 bg-green-500/10 text-green-600 rounded-md font-bold uppercase">Đạt</span>
                          ) : (
                            <span className="text-xs px-3 py-1 bg-destructive/10 text-destructive rounded-md font-bold uppercase">Chưa Đạt</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                        Bạn chưa hoàn thành bài thi nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="animate-fade-in outline-none">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="text-primary w-5 h-5" /> Cập nhật thông tin
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
              {/* Profile Image Upload Component */}
              <div className="flex flex-col items-center sm:items-start gap-4 mb-6 pb-6 border-b border-border">
                <Label className="text-sm font-semibold text-muted-foreground">Ảnh Đại Diện</Label>
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all flex items-center justify-center bg-muted relative">
                    {profileImg ? (
                      <img src={getImageUrl(profileImg)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-2xl font-bold text-muted-foreground uppercase">{user?.name?.charAt(0) || "U"}</div>
                    )}
                    {/* Hover mask */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Thay ảnh</span>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">Chấp nhận JPG, PNG, GIF. Kích thước tối đa 5MB.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và Tên</Label>
                  <Input id="name" {...register("name", { required: "Vui lòng nhập tên" })} className="bg-muted/30" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Không thể thay đổi)</Label>
                  <Input id="email" value={user?.email} disabled className="bg-muted opacity-60" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="contactNo">Số điện thoại</Label>
                  <Input id="contactNo" {...register("contactNo")} className="bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <Select onValueChange={(val) => setValue("gender", val)} defaultValue={user?.gender || "male"}>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" {...register("address")} className="bg-muted/30" />
              </div>

              <div className="pt-4 border-t border-border">
                <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto min-w-[140px] rounded-xl font-bold">
                  {isUpdating ? "Đang lưu..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
