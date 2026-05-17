import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchQuestion, createQuestion, updateQuestion, deleteQuestion } from "@/redux/slice/questionSlice";
import { fetchExam } from "@/redux/slice/examSlice";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";
import type { IQuestion } from "@/types/backend";
import { Edit, Trash2, Plus, X, Search, Upload } from "lucide-react";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  dataUpdate: IQuestion | null;
  setDataUpdate: (v: IQuestion | null) => void;
  onSuccess: () => void;
}

const QuestionFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IProps) => {
  const { register, handleSubmit, reset, control, watch } = useForm<Partial<IQuestion>>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options" as any,
  });

  const dispatch = useAppDispatch();
  const { isFetching } = useAppSelector((state) => state.question);
  const { data: exams } = useAppSelector((state) => state.exam);

  const questionType = watch("type");

  useEffect(() => {
    if (open) {
      dispatch(fetchExam({ query: "limit=100" }));
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        content: "",
        type: "SINGLE_CHOICE",
        score: 1,
        order: 0,
        explanation: "",
        examId: "",
        options: [
          { content: "", isCorrect: false, order: 0 },
          { content: "", isCorrect: false, order: 1 },
        ]
      });
    }
  }, [dataUpdate, reset, open]);

  const onSubmit = async (data: Partial<IQuestion>) => {
    try {
      // Build clean options array
      const cleanOptions = (data.type === "ESSAY" || data.type === "FILL_BLANK")
        ? undefined
        : data.options?.map((opt: any, index: number) => ({
          content: opt.content || "",
          isCorrect: !!opt.isCorrect,
          order: index
        }));

      const formattedData = {
        examId: data.examId,
        content: data.content,
        type: data.type,
        score: Number(data.score) || 0,
        order: Number(data.order) || 0,
        explanation: data.explanation || "",
        options: cleanOptions
      };

      if (dataUpdate) {
        await dispatch(updateQuestion({ question: formattedData as any, id: dataUpdate.id })).unwrap();
        toast.success("Question updated successfully");
      } else {
        await dispatch(createQuestion(formattedData as any)).unwrap();
        toast.success("Question created successfully");
      }
      setOpen(false);
      setDataUpdate(null);
      reset();
      onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(dataUpdate ? "Failed to update question" : "Failed to create question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) setDataUpdate(null);
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dataUpdate ? "Update Question" : "Create New Question"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examId">Exam</Label>
              <Controller
                name="examId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" {...register("order", { required: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Question Content</Label>
            <Textarea
              id="content"
              {...register("content", { required: true })}
              placeholder="Enter question content..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="FILL_BLANK">Fill Blank</SelectItem>
                      <SelectItem value="MATCHING">Matching</SelectItem>
                      <SelectItem value="ESSAY">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input id="score" type="number" {...register("score", { required: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              {...register("explanation")}
              placeholder="Enter explanation for the correct answer..."
            />
          </div>

          {!["ESSAY", "FILL_BLANK"].includes(questionType || "") && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label>Answer Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ content: "", isCorrect: false, order: fields.length })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3 group">
                    <div className="flex items-center h-10">
                      <Controller
                        name={`options.${index}.isCorrect` as any}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        {...register(`options.${index}.content` as any, { required: true })}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 opacity-0 group-hover:opacity-100"
                      onClick={() => remove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isFetching} className="w-full sticky bottom-0">
            {isFetching ? "Saving..." : (dataUpdate ? "Update Question" : "Create Question")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface IBulkProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSuccess: () => void;
}

const QuestionBulkImportModal = ({ open, setOpen, onSuccess }: IBulkProps) => {
  const dispatch = useAppDispatch();
  const { data: exams } = useAppSelector((state) => state.exam);

  const [examId, setExamId] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchExam({ query: "limit=100" }));
      setExamId("");
      setJsonText("");
      setFileError(null);
      setParsedPreview(null);
      setIsImporting(false);
    }
  }, [dispatch, open]);

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    if (!val.trim()) {
      setParsedPreview(null);
      setFileError(null);
      return;
    }
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        setFileError("JSON must be an array of questions.");
        setParsedPreview(null);
        return;
      }
      setFileError(null);
      setParsedPreview(parsed);
    } catch (e: any) {
      setFileError("Invalid JSON syntax: " + e.message);
      setParsedPreview(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleJsonChange(text);
    };
    reader.onerror = () => {
      setFileError("Failed to read file.");
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) {
      toast.error("Please select an exam first.");
      return;
    }
    if (fileError || !parsedPreview || parsedPreview.length === 0) {
      toast.error("Please provide a valid JSON list of questions.");
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    try {
      for (const q of parsedPreview) {
        // Clean options for types like ESSAY or FILL_BLANK which shouldn't have them
        const hasOptions = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE", "MATCHING"].includes(q.type);
        const cleanOptions = hasOptions
          ? q.options?.map((opt: any, index: number) => ({
            content: opt.content || "",
            isCorrect: !!opt.isCorrect,
            order: typeof opt.order === "number" ? opt.order : index + 1
          }))
          : undefined;

        const formattedQuestion = {
          examId,
          content: q.content || "",
          type: q.type || "SINGLE_CHOICE",
          score: typeof q.score === "number" ? q.score : 1,
          order: typeof q.order === "number" ? q.order : successCount + 1,
          explanation: q.explanation || "",
          options: cleanOptions
        };

        await dispatch(createQuestion(formattedQuestion)).unwrap();
        successCount++;
      }

      toast.success(`Successfully imported ${successCount} questions!`);
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      console.error("Failed to import question at index " + successCount, err);
      toast.error(`Import stopped. Successfully imported ${successCount}/${parsedPreview.length} questions. Error: ${err?.message || "Unknown error"}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Questions (JSON)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="importExamId">Target Exam</Label>
            <Select onValueChange={setExamId} value={examId}>
              <SelectTrigger id="importExamId">
                <SelectValue placeholder="Select an exam to import questions into" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/40">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm">Download Template</h4>
              <p className="text-xs text-muted-foreground">Download the sample JSON file to see correct formatting.</p>
            </div>
            <a
              href="/templates/questions-template.json"
              download="questions-template.json"
            >
              <Button type="button" variant="outline" size="sm">
                Download JSON Template
              </Button>
            </a>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jsonFile">Upload JSON File</Label>
            <Input
              id="jsonFile"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">Or paste raw JSON</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jsonText">JSON Content</Label>
            <Textarea
              id="jsonText"
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="Paste question array JSON here..."
              className="font-mono text-xs min-h-[150px] bg-muted/20"
            />
            {fileError && (
              <p className="text-xs text-destructive font-medium mt-1">{fileError}</p>
            )}
          </div>

          {parsedPreview && (
            <div className="border rounded-lg p-3 bg-primary/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-primary">Parsed Preview Summary:</span>
                <span>{parsedPreview.length} questions found</span>
              </div>
              <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {parsedPreview.map((q: any, i: number) => (
                  <div key={i} className="text-xs border rounded bg-card p-1.5 flex justify-between gap-4">
                    <span className="truncate font-medium flex-1">
                      {i + 1}. {q.content || "Empty content"}
                    </span>
                    <span className="text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded h-fit shrink-0 font-semibold">
                      {q.type || "UNKNOWN"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isImporting || !examId || !parsedPreview || parsedPreview.length === 0}
            className="w-full"
          >
            {isImporting ? "Importing..." : `Import ${parsedPreview?.length || 0} Questions`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function QuestionPage() {
  const dispatch = useAppDispatch();
  const { data: questions, isFetching, meta } = useAppSelector((state) => state.question);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IQuestion | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchQuestion({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  const loadQuestions = () => {
    dispatch(fetchQuestion({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteQuestion({ id })).unwrap();
      toast.success("Question deleted successfully");
      loadQuestions();
    } catch {
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {isFetching && !openModal && <Loading />}

      <QuestionFormModal
        open={openModal}
        setOpen={setOpenModal}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadQuestions}
      />

      <QuestionBulkImportModal
        open={openBulkModal}
        setOpen={setOpenBulkModal}
        onSuccess={loadQuestions}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Question Management</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => setOpenBulkModal(true)}>
            <Upload className="w-4 h-4 mr-2" /> Bulk Import
          </Button>
          <Button onClick={() => {
            setDataUpdate(null);
            setOpenModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Create Question
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Order</TableHead>
              <TableHead className="w-[40%]">Question Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-mono text-xs">{question.order}</TableCell>
                  <TableCell className="max-w-[400px]">
                    <p className="truncate font-medium" title={question.content}>
                      {question.content}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold px-2 py-1 bg-muted rounded">
                      {question.type}
                    </span>
                  </TableCell>
                  <TableCell>{question.score}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDataUpdate(question);
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
                              This action cannot be undone. This will permanently delete the question and its options.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(question.id)}>Continue</AlertDialogAction>
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
