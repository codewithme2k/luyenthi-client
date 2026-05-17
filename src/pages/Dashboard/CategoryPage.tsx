import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategory, createCategory, updateCategory, deleteCategory } from "@/redux/slice/categorySlice";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";
import type { ICategory } from "@/types/backend";
import { Edit, Trash2, Plus, Search } from "lucide-react";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  dataUpdate: ICategory | null;
  setDataUpdate: (v: ICategory | null) => void;
  onSuccess: () => void;
}

const CategoryFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IProps) => {
  const { register, handleSubmit, reset } = useForm<Partial<ICategory>>();
  const dispatch = useAppDispatch();
  const { isFetching } = useAppSelector((state) => state.category);

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        name: "",
        slug: ""
      });
    }
  }, [dataUpdate, reset, open]);

  const onSubmit = async (data: Partial<ICategory>) => {
    try {
      if (dataUpdate) {
        await dispatch(updateCategory({ category: data, id: dataUpdate.id })).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory(data)).unwrap();
        toast.success("Category created successfully");
      }
      setOpen(false);
      setDataUpdate(null);
      reset();
      onSuccess();
    } catch {
      toast.error(dataUpdate ? "Failed to update category" : "Failed to create category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) setDataUpdate(null);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dataUpdate ? "Update Category" : "Create New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug", { required: true })} />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Saving..." : (dataUpdate ? "Update Category" : "Create Category")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const { data: categories, isFetching, meta } = useAppSelector((state) => state.category);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  const [openModal, setOpenModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ICategory | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchCategory({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  const loadCategories = () => {
    dispatch(fetchCategory({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategory({ id })).unwrap();
      toast.success("Category deleted successfully");
      loadCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {isFetching && !openModal && <Loading />}
      
      <CategoryFormModal 
        open={openModal} 
        setOpen={setOpenModal} 
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadCategories} 
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
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
            <Plus className="w-4 h-4 mr-2" /> Create Category
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-xs">{category.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setDataUpdate(category);
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
                              This action cannot be undone. This will permanently delete the category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>Continue</AlertDialogAction>
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
