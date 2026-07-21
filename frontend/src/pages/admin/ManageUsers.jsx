import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2, Search } from "lucide-react";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../../api/serviceAPI";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";

const emptyForm = { name: "", email: "", password: "", role: "user", balance: 0, isActive: true };

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1); // ✅ NEW: current page
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery(
    ["admin:users", page],
    () => adminList("users", { page, limit: 20 }),
    { keepPreviousData: true }
  );
  const users = data?.data?.users || [];
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    return [user.name, user.email, user.role, user._id].some((value) => String(value || "").toLowerCase().includes(term));
  });
  const totalPages = data?.data?.pages || 1; // ✅ NEW

  const saveMutation = useMutation((payload) => payload._id ? adminUpdate("users", payload._id, payload) : adminCreate("users", payload), {
    onSuccess: () => {
      toast.success("User saved");
      setModal(false);
      setForm(emptyForm);
      queryClient.invalidateQueries("admin:users");
    }
  });
  const deleteMutation = useMutation((id) => adminDelete("users", id), {
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries("admin:users");
    }
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (row) => <Badge status={row.role === "admin" ? "processing" : "success"} label={row.role} /> },
    { key: "balance", header: "Balance", render: (row) => formatCurrency(row.balance) },
    { key: "isActive", header: "Status", render: (row) => <Badge status={row.isActive ? "success" : "failed"} label={row.isActive ? "active" : "disabled"} /> },
    {
      key: "actions", header: "Actions", render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3" onClick={() => { setForm({ ...row, password: "" }); setModal(true); }}><Save size={15} /></button>
          <button className="btn-secondary px-3" onClick={() => { if (window.confirm("Delete this permanently? This can't be undone.")) { deleteMutation.mutate(row._id); } }}><Trash2 size={15} /></button>
        </div>
      )
    }
  ];

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, balance: Number(form.balance), isActive: Boolean(form.isActive) };
    if (payload._id && !payload.password) delete payload.password;
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              className="field w-full pl-10"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button className="btn-primary" onClick={() => { setForm(emptyForm); setModal(true); }}><Plus size={17} /> Add User</button>
        </div>
      </div>
      <Table columns={columns} data={filteredUsers} loading={isLoading} />
      {/* ✅ NEW: page change controls */}
      <div className="flex items-center justify-between">
        <button
          className="btn-secondary px-4 py-2"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
        <button
          className="btn-secondary px-4 py-2"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
      <Modal open={modal} title={form._id ? "Edit user" : "Add user"} onClose={() => setModal(false)}>
        <form onSubmit={submit} className="space-y-3">
          <input className="field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!form._id} />
          <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input className="field" type="number" min="0" placeholder="Balance" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <button className="btn-primary w-full" disabled={saveMutation.isLoading}>Save user</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;