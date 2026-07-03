import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../../api/serviceAPI";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import formatDate from "../../utils/formatDate";

const emptyForm = { title: "", message: "", type: "info", isActive: true };
const noticeStatus = {
  info: "processing",
  warning: "pending",
  success: "success",
  danger: "failed"
};

const ManageNotices = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { data, isLoading } = useQuery("admin:notices", () => adminList("notices"));
  const notices = data?.data?.notices || [];

  const saveMutation = useMutation((payload) => payload._id ? adminUpdate("notices", payload._id, payload) : adminCreate("notices", payload), {
    onSuccess: () => {
      toast.success("Notice saved");
      setModal(false);
      queryClient.invalidateQueries("admin:notices");
      queryClient.invalidateQueries("notices");
    }
  });
  const deleteMutation = useMutation((id) => adminDelete("notices", id), {
    onSuccess: () => {
      toast.success("Notice deleted");
      queryClient.invalidateQueries("admin:notices");
    }
  });

  const columns = [
    { key: "title", header: "Title" },
    { key: "type", header: "Type", render: (row) => <Badge status={noticeStatus[row.type] || "processing"} label={row.type} /> },
    { key: "isActive", header: "Status", render: (row) => <Badge status={row.isActive ? "success" : "failed"} label={row.isActive ? "active" : "disabled"} /> },
    { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions", header: "Actions", render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3" onClick={() => { setForm(row); setModal(true); }}><Save size={15} /></button>
          <button className="btn-secondary px-3" onClick={() => { if (window.confirm("Delete this permanently? This can't be undone.")) { deleteMutation.mutate(row._id); } }}><Trash2 size={15} /></button>
        </div>
      )
    }
  ];

  const submit = (event) => {
    event.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Notices</h1>
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setModal(true); }}><Plus size={17} /> Add Notice</button>
      </div>
      <Table columns={columns} data={notices} loading={isLoading} />
      <Modal open={modal} title={form._id ? "Edit notice" : "Add notice"} onClose={() => setModal(false)}>
        <form onSubmit={submit} className="space-y-3">
          <input className="field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="field min-h-[120px]" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="danger">Danger</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <button className="btn-primary w-full" disabled={saveMutation.isLoading}>Save notice</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageNotices;
