import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Save, Trash2, ExternalLink } from "lucide-react"; // Added ExternalLink icon
import { adminDelete, adminList, adminUpdate } from "../../api/serviceAPI";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const ManageOrders = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(null);
  const { data, isLoading } = useQuery("admin:orders", () => adminList("orders"));
  const orders = data?.data?.orders || [];

  const mutation = useMutation((payload) => adminUpdate("orders", payload._id, payload), {
    onSuccess: () => {
      toast.success("Order updated");
      setModal(false);
      queryClient.invalidateQueries("admin:orders");
    }
  });

  const deleteMutation = useMutation((id) => adminDelete("orders", id), {
    onSuccess: () => {
      toast.success("Order deleted");
      queryClient.invalidateQueries("admin:orders");
    }
  });

  const columns = [
    { key: "user", header: "User", render: (row) => row.userId?.email || "-" },
    { key: "service", header: "Service", render: (row) => row.serviceId?.name || "-" },
    {
      key: "link",
      header: "Link",
      render: (row) => row.link ? (
        <a href={row.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
          <ExternalLink size={14} /> Link
        </a>
      ) : "-"
    },
    { key: "quantity", header: "Qty" },
    { key: "charge", header: "Charge", render: (row) => formatCurrency(row.charge) },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions", header: "Actions", render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3" onClick={() => { setForm(row); setModal(true); }}>
            <Save size={15} />
          </button>
          <button className="btn-secondary px-3" onClick={() => { if (window.confirm("Delete this permanently? This can't be undone.")) { deleteMutation.mutate(row._id); } }}>
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate({
      _id: form._id,
      status: form.status,
      link: form.link || "", // Added link to the mutation payload
      startCount: Number(form.startCount || 0),
      remains: Number(form.remains || 0),
      providerOrderId: form.providerOrderId || "",
      providerError: form.providerError || ""
    });
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <Table columns={columns} data={orders} loading={isLoading} />

      <Modal open={modal} title="Update order" onClose={() => setModal(false)}>
        {form && (
          <form onSubmit={submit} className="space-y-3">
            <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {["pending", "processing", "completed", "cancelled", "partial"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Added Link Input */}
            <input
              className="field"
              type="url"
              placeholder="Target Link"
              value={form.link || ""}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            <input className="field" type="number" min="0" placeholder="Start count" value={form.startCount || 0} onChange={(e) => setForm({ ...form, startCount: e.target.value })} />
            <input className="field" type="number" min="0" placeholder="Remains" value={form.remains || 0} onChange={(e) => setForm({ ...form, remains: e.target.value })} />
            <input className="field" placeholder="Provider order id" value={form.providerOrderId || ""} onChange={(e) => setForm({ ...form, providerOrderId: e.target.value })} />
            <textarea className="field" rows="3" placeholder="Provider error" value={form.providerError || ""} onChange={(e) => setForm({ ...form, providerError: e.target.value })} />

            <button className="btn-primary w-full" disabled={mutation.isLoading}>
              Save order
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrders;