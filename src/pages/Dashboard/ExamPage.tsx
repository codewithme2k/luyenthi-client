import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchExam, createExam, updateExam, deleteExam } from "@/redux/slice/examSlice";
import { fetchCategory } from "@/redux/slice/categorySlice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";
import type { IExam } from "@/types/backend";
import { Edit, Trash2, Plus, Search } from "lucide-react";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  dataUpdate: IExam | null;
  setDataUpdate: (v: IExam | null) => void;
  onSuccess: () => void;
}

const ExamFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IProps) => {
  const { register, handleSubmit, reset, control } = useForm<Partial<IExam>>();
  const dispatch = useAppDispatch();
  const { isFetching } = useAppSelector((state) => state.exam);
  const { data: categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    if (open) {
      dispatch(fetchCategory({ query: "limit=100" }));
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        title: "",
        slug: "",
        description: "",
        categoryId: "",
        duration: 0,
        totalMarks: 0,
        passMarks: 0,
        isPublished: false,
        isPremium: false
      });
    }
  }, [dataUpdate, reset, open]);

  const onSubmit = async (data: Partial<IExam>) => {
    try {
      const formattedData = {
        ...data,
        duration: Number(data.duration),
        totalMarks: Number(data.totalMarks),
        passMarks: Number(data.passMarks),
        isPublished: !!data.isPublished,
        isPremium: !!data.isPremium
      };

      if (dataUpdate) {
        await dispatch(updateExam({ exam: formattedData, id: dataUpdate.id })).unwrap();
        toast.success("Exam updated successfully");
      } else {
        await dispatch(createExam(formattedData)).unwrap();
        toast.success("Exam created successfully");
      }
      setOpen(false);
      setDataUpdate(null);
      reset();
      onSuccess();
    } catch {
      toast.error(dataUpdate ? "Failed to update exam" : "Failed to create exam");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) setDataUpdate(null);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dataUpdate ? "Update Exam" : "Create New Exam"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="flex min-h-[85px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nhập mô tả đề thi..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (m)</Label>
              <Input id="duration" type="number" {...register("duration", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input id="totalMarks" type="number" {...register("totalMarks", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passMarks">Pass Marks</Label>
              <Input id="passMarks" type="number" {...register("passMarks", { required: true })} />
            </div>
          </div>
          
          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                {...register("isPublished")}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 cursor-pointer"
              />
              <Label htmlFor="isPublished" className="font-semibold text-xs text-foreground cursor-pointer">
                Publish Exam
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPremium"
                {...register("isPremium")}
                className="w-4 h-4 text-amber-500 bg-background border-border rounded focus:ring-amber-500 focus:ring-2 cursor-pointer"
              />
              <Label htmlFor="isPremium" className="font-bold text-xs text-amber-600 flex items-center gap-0.5 cursor-pointer">
                👑 Premium VIP
              </Label>
            </div>
          </div>

          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Saving..." : (dataUpdate ? "Update Exam" : "Create Exam")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function ExamPage() {
  const dispatch = useAppDispatch();
  const { data: exams, isFetching, meta } = useAppSelector((state) => state.exam);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  const [openModal, setOpenModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IExam | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchExam({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  const loadExams = () => {
    dispatch(fetchExam({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExam({ id })).unwrap();
      toast.success("Exam deleted successfully");
      loadExams();
    } catch {
      toast.error("Failed to delete exam");
    }
  };

  return (
    <div className="p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in">
      {isFetching && !openModal && <Loading />}
      
      <ExamFormModal 
        open={openModal} 
        setOpen={setOpenModal} 
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadExams} 
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Management</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <Button onClick={() => {
            setDataUpdate(null);
            setOpenModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Create Exam
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No exams found.
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell className="font-mono text-xs">{exam.categoryId.substring(0, 8)}</TableCell>
                  <TableCell>{exam.duration}m</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${exam.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {exam.isPublished ? "Published" : "Draft"}
                      </span>
                      {exam.isPremium && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">
                          👑 Premium
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setDataUpdate(exam);
                          setOpenModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the exam.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(exam.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
