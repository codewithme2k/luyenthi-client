import React, { useEffect, useState } from "react";
import { 
  callFetchAllMembershipRequests, 
  callApproveMembershipRequest, 
  callRejectMembershipRequest 
} from "@/config/api";
import { toast } from "sonner";
import { 
  Check, 
  X, 
  Clock, 
  Search, 
  Crown, 
  Calendar, 
  User, 
  Filter,
  RefreshCw,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { IMembershipRequest } from "@/types/backend";

export const AdminMembershipPage: React.FC = () => {
  const [requests, setRequests] = useState<IMembershipRequest[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchRequests = async () => {
    setIsFetching(true);
    try {
      let query = `page=${page}&limit=${limit}`;
      if (searchTerm.trim()) {
        query += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
      }
      if (statusFilter !== "ALL") {
        query += `&status=${statusFilter}`;
      }

      const res = await callFetchAllMembershipRequests(query);
      if (res.data?.success) {
        setRequests(res.data.data);
        setTotal(res.data.meta?.total || 0);
      } else {
        toast.error("Failed to load requests");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error loading requests");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRequests();
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      const res = await callApproveMembershipRequest(id);
      if (res.data?.success) {
        toast.success(res.data.message || "Approved request successfully!");
        fetchRequests();
      } else {
        toast.error(res.data?.message || "Failed to approve");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Approval error occurred");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await callRejectMembershipRequest(id);
      if (res.data?.success) {
        toast.success(res.data.message || "Rejected request successfully!");
        fetchRequests();
      } else {
        toast.error(res.data?.message || "Failed to reject");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Rejection error occurred");
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const getStatusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case "APPROVED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit"><Check className="w-3.5 h-3.5" /> Approved</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 w-fit"><X className="w-3.5 h-3.5" /> Rejected</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500 fill-amber-500/10" />
            Membership Requests
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Phê duyệt nâng cấp Premium VIP cho học sinh thủ công từ chuyển khoản ngân hàng.
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRequests} 
          disabled={isFetching}
          className="rounded-xl flex items-center gap-1 text-xs cursor-pointer border-border font-bold bg-background hover:bg-muted"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Tải lại
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center glass p-4 rounded-2xl border border-border/50">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo Mã giao dịch, Tên học sinh, Email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-11 bg-background rounded-xl border-input text-xs font-semibold"
          />
        </div>

        {/* Status Select Filter */}
        <div className="flex items-center gap-2 md:col-span-2 justify-end select-none">
          <span className="text-xs font-extrabold text-muted-foreground flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc trạng thái:
          </span>
          <div className="flex bg-muted/60 border p-1 rounded-xl gap-1">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-background text-primary shadow-sm border border-border/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st === "ALL" ? "Tất cả" : st === "PENDING" ? "Chờ duyệt" : st === "APPROVED" ? "Đã duyệt" : "Từ chối"}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Table grid */}
      <div className="border rounded-2xl bg-card overflow-hidden border-border/60 shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40 font-bold">
            <TableRow>
              <TableHead className="font-bold text-foreground">Học Sinh</TableHead>
              <TableHead className="font-bold text-foreground">Gói Cước</TableHead>
              <TableHead className="font-bold text-foreground">Số Tiền</TableHead>
              <TableHead className="font-bold text-foreground">Mã GD Bank</TableHead>
              <TableHead className="font-bold text-foreground">Ngày Yêu Cầu</TableHead>
              <TableHead className="font-bold text-foreground">Hạn Dùng VIP</TableHead>
              <TableHead className="font-bold text-foreground">Trạng Thái</TableHead>
              <TableHead className="text-right font-bold text-foreground">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground font-semibold">
                  Không tìm thấy yêu cầu nâng cấp nào.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black shadow-inner shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-foreground truncate">{req.user?.name || "Học sinh"}</p>
                        <p className="text-xs text-muted-foreground truncate">{req.user?.email}</p>
                        {req.user?.contactNo && (
                          <p className="text-[10px] text-muted-foreground truncate font-mono">SĐT: {req.user.contactNo}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-extrabold text-xs text-foreground bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                      {req.plan === "ONE_MONTH" ? "1 Tháng" : req.plan === "SIX_MONTHS" ? "6 Tháng" : "1 Năm"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <strong className="text-sm font-black text-primary">{formatPrice(req.amount)}</strong>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground text-xs uppercase bg-muted/60 border border-border/80 px-2 py-0.5 rounded-md w-fit">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      {req.transactionCode}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary/70" />
                      {formatDate(req.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {req.user?.isPremium && req.user?.premiumUntil ? (
                      <div className="flex flex-col gap-0.5 min-w-[120px]">
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 w-fit flex items-center gap-1 shadow-sm">
                          <Crown className="w-3 h-3 fill-current" /> VIP Hoạt Động
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Hạn: {formatShortDate(req.user.premiumUntil)}
                        </span>
                      </div>
                    ) : req.user?.premiumUntil ? (
                      <div className="flex flex-col gap-0.5 min-w-[120px]">
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border w-fit flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" /> Hết Hạn VIP
                        </span>
                        <span className="text-[10px] text-muted-foreground/80 font-mono">
                          Hạn: {formatShortDate(req.user.premiumUntil)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">
                        Chưa kích hoạt VIP
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(req.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "PENDING" ? (
                      <div className="flex justify-end gap-2 select-none">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(req.id)}
                          className="h-8 rounded-lg px-2 text-rose-500 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 hover:text-rose-600 transition-colors font-bold text-xs cursor-pointer flex items-center gap-0.5"
                        >
                          <X className="w-3.5 h-3.5" /> Từ chối
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          className="h-8 rounded-lg px-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer flex items-center gap-0.5 border-none shadow-md shadow-emerald-500/10"
                        >
                          <Check className="w-3.5 h-3.5" /> Duyệt
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-semibold">Hoàn tất</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {!isFetching && totalPages > 1 && (
        <div className="mt-4 select-none">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50 border cursor-pointer" : "border cursor-pointer"}
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
                    className="border cursor-pointer"
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
                  className={page >= totalPages ? "pointer-events-none opacity-50 border cursor-pointer" : "border cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

    </div>
  );
};

export default AdminMembershipPage;
