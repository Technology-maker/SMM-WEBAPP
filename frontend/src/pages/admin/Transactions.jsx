import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Save, Trash2, Filter } from "lucide-react";
import { adminDelete, adminList, adminUpdate } from "../../api/serviceAPI";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

// ✅ NEW: order-related methods vs wallet/user-related methods
const ORDER_METHODS = ["order", "refund", "partial_refund"];

const Transactions = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("order"); // ✅ NEW: "order" | "user"
  const [statusFilter, setStatusFilter] = useState("all"); // ✅ NEW: "all" | "pending" | "success" | "failed"
  const [filterOpen, setFilterOpen] = useState(false); // ✅ NEW: filter dropdown toggle
  // ✅ NEW: backend paginates (default limit 20, max 100 per page) — loop through
  // all pages so the admin sees every transaction in the database, not just page 1.
  const fetchAllTransactions = async () => {
    const first = await adminList("transactions", { page: 1, limit: 100 });
    let all = first?.data?.transactions || [];
    const pages = first?.data?.pages || 1;

    if (pages > 1) {
      const rest = await Promise.all(
        Array.from({ length: pages - 1 }, (_, i) => adminList("transactions", { page: i + 2, limit: 100 }))
      );
      rest.forEach((res) => { all = all.concat(res?.data?.transactions || []); });
    }

    return { data: { transactions: all, total: first?.data?.total ?? all.length } };
  };

  const { data, isLoading } = useQuery("admin:transactions", fetchAllTransactions);
  const transactions = data?.data?.transactions || [];
  const normalizedSearch = search.trim().toLowerCase();

  // ✅ NEW: split transactions by tab first
  const tabTransactions = transactions.filter((row) =>
    tab === "order" ? ORDER_METHODS.includes(row.method) : !ORDER_METHODS.includes(row.method)
  );

  const filteredTransactions = tabTransactions
    .filter((row) => statusFilter === "all" || row.status === statusFilter) // ✅ NEW: status filter
    .filter((row) => {
      if (!normalizedSearch) return true;

      const email = (row.userId?.email || "").toLowerCase();
      const reference = (row.reference || "").toLowerCase();
      const createdAt = row.createdAt ? new Date(row.createdAt).toLocaleDateString().toLowerCase() : "";
      const rawDate = (row.createdAt || "").toString().toLowerCase();

      return [email, reference, createdAt, rawDate].some((value) => value.includes(normalizedSearch));
    });

  const updateMutation = useMutation((payload) => adminUpdate("transactions", payload._id, payload), {
    onSuccess: () => {
      toast.success("Transaction updated");
      setModal(false);
      queryClient.invalidateQueries("admin:transactions");
    }
  });

  const deleteMutation = useMutation((id) => adminDelete("transactions", id), {
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries("admin:transactions");
    }
  });

  const columns = [
    { key: "user", header: "User", render: (row) => row.userId?.email || "-" },
    { key: "type", header: "Type" },
    { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
    { key: "method", header: "Method" },
    // ✅ NEW: UTR column
    {
      key: "utr",
      header: "UTR",
      render: (row) =>
        row.utr
          ? <span className="block max-w-[160px] truncate font-mono text-xs">{row.utr}</span>
          : <span className="text-slate-400 text-xs">—</span>
    },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    { key: "reference", header: "Reference", render: (row) => <span className="block max-w-[220px] truncate">{row.reference}</span> },
    { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3" onClick={() => { setForm(row); setModal(true); }}><Save size={15} /></button>
          <button className="btn-secondary px-3" onClick={() => { if (window.confirm("Delete this permanently? This can't be undone.")) { deleteMutation.mutate(row._id); } }}><Trash2 size={15} /></button>
        </div>
      )
    }
  ];

  const submit = (event) => {
    event.preventDefault();
    updateMutation.mutate({
      _id: form._id,
      status: form.status,
      method: form.method,
      amount: Number(form.amount),
      utr: form.utr?.trim() || null  // ✅ NEW
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <input
            className="field max-w-sm"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, reference or date"
          />
          {/* ✅ NEW: Filter button + status dropdown */}
          <div className="relative">
            <button
              className={statusFilter !== "all" ? "btn-primary px-3" : "btn-secondary px-3"}
              onClick={() => setFilterOpen((open) => !open)}
            >
              <Filter size={15} />
            </button>
            {filterOpen && (
              <div className="glass absolute right-0 z-10 mt-2 w-44 rounded-lg p-3 shadow-2xl">
                <label className="mb-1 block text-xs text-slate-400 font-medium">Status</label>
                <select
                  className="field"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">pending</option>
                  <option value="success">success</option>
                  <option value="failed">failed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ✅ NEW: Order Transactions / User Transactions tabs */}
      <div className="flex gap-2">
        <button
          className={tab === "order" ? "btn-primary px-4 py-2" : "btn-secondary px-4 py-2"}
          onClick={() => setTab("order")}
        >
          Order Transactions
        </button>
        <button
          className={tab === "user" ? "btn-primary px-4 py-2" : "btn-secondary px-4 py-2"}
          onClick={() => setTab("user")}
        >
          User Transactions
        </button>
      </div>
      <Table columns={columns} data={filteredTransactions} loading={isLoading} />
      <Modal open={modal} title="Update transaction" onClose={() => setModal(false)}>
        {form && (
          <form onSubmit={submit} className="space-y-3">
            <input
              className="field"
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              className="field"
              value={form.method || ""}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            />
            {/* ✅ NEW: UTR field — shown only for manual/upi, editable for admin */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">UTR / Transaction ID</label>
              <input
                className="field font-mono"
                placeholder="e.g. 424212345678"
                value={form.utr || ""}
                onChange={(e) => setForm({ ...form, utr: e.target.value })}
              />
              {form.utr && form.utr.trim().length > 0 && form.utr.trim().length < 12 && (
                <p className="text-xs text-red-400">UTR must be at least 12 characters</p>
              )}
            </div>
            <select
              className="field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">pending</option>
              <option value="success">success</option>
              <option value="failed">failed</option>
            </select>
            <button
              className="btn-primary w-full"
              disabled={
                updateMutation.isLoading ||
                (form.utr && form.utr.trim().length > 0 && form.utr.trim().length < 12)
              }
            >
              Save transaction
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;