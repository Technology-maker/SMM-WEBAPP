import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../../api/serviceAPI";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";

const emptyForm = { name: "", icon: "sparkles", isActive: true };

const ManageCategories = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { data, isLoading } = useQuery("admin:categories", () => adminList("categories"));
  const categories = data?.data?.categories || [];

  const saveMutation = useMutation((payload) => payload._id ? adminUpdate("categories", payload._id, payload) : adminCreate("categories", payload), {
    onSuccess: () => {
      toast.success("Category saved");
      setModal(false);
      queryClient.invalidateQueries("admin:categories");
      queryClient.invalidateQueries("categories");
    }
  });
  const deleteMutation = useMutation((id) => adminDelete("categories", id), {
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries("admin:categories");
    }
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "icon", header: "Icon" },
    { key: "isActive", header: "Status", render: (row) => <Badge status={row.isActive ? "success" : "failed"} label={row.isActive ? "active" : "disabled"} /> },
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
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setModal(true); }}><Plus size={17} /> Add Category</button>
      </div>
      <Table columns={columns} data={categories} loading={isLoading} />
      <Modal open={modal} title={form._id ? "Edit category" : "Add category"} onClose={() => setModal(false)}>
        <form onSubmit={submit} className="space-y-3">
          <input className="field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="field" placeholder="Icon name" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <button className="btn-primary w-full" disabled={saveMutation.isLoading}>Save category</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
