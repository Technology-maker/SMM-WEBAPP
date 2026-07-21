import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2, Search } from "lucide-react";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../../api/serviceAPI";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";

const emptyForm = { name: "", category: "", providerServiceId: "", providerName: "Manual", rate: 0, minOrder: 1, maxOrder: 1000, description: "", isActive: true };

const ManageServices = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery("admin:services", () => adminList("services"));
  const categoriesQuery = useQuery("admin:categories", () => adminList("categories"));
  const services = data?.data?.services || [];
  const filteredServices = services.filter((service) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    return [
      service.name,
      service.category?.name,
      service.providerName,
      service.providerServiceId,
      service.description,
      service._id
    ].some((value) => String(value || "").toLowerCase().includes(term));
  });
  const categories = categoriesQuery.data?.data?.categories || [];

  const saveMutation = useMutation((payload) => payload._id ? adminUpdate("services", payload._id, payload) : adminCreate("services", payload), {
    onSuccess: () => {
      toast.success("Service saved");
      setModal(false);
      queryClient.invalidateQueries("admin:services");
      queryClient.invalidateQueries("services");
    }
  });
  const deleteMutation = useMutation((id) => adminDelete("services", id), {
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries("admin:services");
    }
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "category", header: "Category", render: (row) => row.category?.name || "-" },
    { key: "providerName", header: "Provider" },
    { key: "rate", header: "Rate", render: (row) => formatCurrency(row.rate) },
    { key: "limits", header: "Limits", render: (row) => `${row.minOrder}-${row.maxOrder}` },
    { key: "isActive", header: "Status", render: (row) => <Badge status={row.isActive ? "success" : "failed"} label={row.isActive ? "active" : "disabled"} /> },
    {
      key: "actions", header: "Actions", render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3" onClick={() => { setForm({ ...row, category: row.category?._id || row.category }); setModal(true); }}><Save size={15} /></button>
          <button className="btn-secondary px-3" onClick={() => { if (window.confirm("Delete this permanently? This can't be undone.")) { deleteMutation.mutate(row._id); } }}><Trash2 size={15} /></button>
        </div>
      )
    }
  ];

  const submit = (event) => {
    event.preventDefault();
    saveMutation.mutate({
      ...form,
      rate: Number(form.rate),
      minOrder: Number(form.minOrder),
      maxOrder: Number(form.maxOrder)
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              className="field w-full pl-10"
              placeholder="Search services"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => { setForm({ ...emptyForm, category: categories[0]?._id || "" }); setModal(true); }}><Plus size={17} /> Add Service</button>
        </div>
      </div>
      <Table columns={columns} data={filteredServices} loading={isLoading} />
      <Modal open={modal} title={form._id ? "Edit service" : "Add service"} onClose={() => setModal(false)}>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input className="field md:col-span-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
            <option value="">Choose category</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <select className="field" value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })}>
            <option value="Manual">Manual</option>
            <option value="Peakerr">Peakerr</option>
            <option value="JAP">JAP</option>
            <option value="WorldOfSMM">WorldOfSMM</option>
          </select>
          <input className="field" placeholder="Provider service id" value={form.providerServiceId} onChange={(e) => setForm({ ...form, providerServiceId: e.target.value })} required />
          <input className="field" type="number" min="0" placeholder="Rate" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} required />
          <input className="field" type="number" min="1" placeholder="Min" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} required />
          <input className="field" type="number" min="1" placeholder="Max" value={form.maxOrder} onChange={(e) => setForm({ ...form, maxOrder: e.target.value })} required />
          <textarea className="field md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <button className="btn-primary md:col-span-2" disabled={saveMutation.isLoading}>Save service</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageServices;