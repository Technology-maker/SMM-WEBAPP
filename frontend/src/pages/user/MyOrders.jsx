import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ChevronLeft, ChevronRight, Search, ExternalLink } from "lucide-react";
import { getMyOrders } from "../../api/orderAPI";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const MyOrders = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const { data, isLoading } = useQuery(["orders", page, search], () => getMyOrders({ page, search, limit: 10 }));
  const orders = data?.data?.orders || [];
  const pages = data?.data?.pages || 1;

  const sortedOrders = useMemo(() => {
    const copy = [...orders];
    if (sort === "charge") copy.sort((a, b) => b.charge - a.charge);
    if (sort === "quantity") copy.sort((a, b) => b.quantity - a.quantity);
    return copy;
  }, [orders, sort]);

  const columns = [
    { key: "service", header: "Service", render: (row) => row.serviceId?.name || "Service" },
    {
      key: "link", header: "Link", render: (row) => (
        <a href={row.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
          <ExternalLink size={14} />
          <span>Link</span>
        </a>
      )
    },
    { key: "quantity", header: "Qty" },
    { key: "charge", header: "Charge", render: (row) => formatCurrency(row.charge) },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-sm text-slate-400">Search, sort, and track order progress.</p>
      </div>
      <div className="glass grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_180px]">
        <div className="relative">
          <input className="field pl-10" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search link or status" />
        </div>
        <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="charge">Highest charge</option>
          <option value="quantity">Highest quantity</option>
        </select>
      </div>
      <Table columns={columns} data={sortedOrders} loading={isLoading} />
      <div className="flex items-center justify-end gap-2">
        <button className="btn-secondary px-3" disabled={page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-slate-400">Page {page} of {pages}</span>
        <button className="btn-secondary px-3" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
