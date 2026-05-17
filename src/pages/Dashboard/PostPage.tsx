import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPost, createPost, updatePost, deletePost } from "@/redux/slice/postSlice";
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
import type { IPost } from "@/types/backend";
import { Edit, Trash2, Plus, Search } from "lucide-react";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  dataUpdate: IPost | null;
  setDataUpdate: (v: IPost | null) => void;
  onSuccess: () => void;
}

const PostFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IProps) => {
  const { register, handleSubmit, reset } = useForm<Partial<IPost>>();
  const dispatch = useAppDispatch();
  const { isFetching } = useAppSelector((state) => state.post);

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        title: "",
        slug: "",
        content: "",
        authorId: "",
        isPublished: false
      });
    }
  }, [dataUpdate, reset, open]);

  const onSubmit = async (data: Partial<IPost>) => {
    try {
      if (dataUpdate) {
        await dispatch(updatePost({ post: data, id: dataUpdate.id })).unwrap();
        toast.success("Post updated successfully");
      } else {
        await dispatch(createPost(data)).unwrap();
        toast.success("Post created successfully");
      }
      setOpen(false);
      setDataUpdate(null);
      reset();
      onSuccess();
    } catch {
      toast.error(dataUpdate ? "Failed to update post" : "Failed to create post");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) setDataUpdate(null);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dataUpdate ? "Update Post" : "Create New Post"}</DialogTitle>
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
            <Label htmlFor="content">Content</Label>
            <Input id="content" {...register("content", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorId">Author ID</Label>
            <Input id="authorId" {...register("authorId", { required: true })} />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? "Saving..." : (dataUpdate ? "Update Post" : "Create Post")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function PostPage() {
  const dispatch = useAppDispatch();
  const { data: posts, isFetching, meta } = useAppSelector((state) => state.post);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  const [openModal, setOpenModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IPost | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchPost({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  const loadPosts = () => {
    dispatch(fetchPost({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deletePost({ id })).unwrap();
      toast.success("Post deleted successfully");
      loadPosts();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {isFetching && !openModal && <Loading />}
      
      <PostFormModal 
        open={openModal} 
        setOpen={setOpenModal} 
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadPosts} 
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
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
            <Plus className="w-4 h-4 mr-2" /> Create Post
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${post.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setDataUpdate(post);
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
                              This action cannot be undone. This will permanently delete the post.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>Continue</AlertDialogAction>
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
