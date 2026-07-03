import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { ClipboardList, CheckCircle2, WalletCards, PlusCircle } from "lucide-react";
import { getUserDashboard } from "../../api/authAPI";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const Dashboard = () => {
  const { data, isLoading } = useQuery("user:dashboard", getUserDashboard);
  const dashboard = data?.data;

  const columns = [
    { key: "service", header: "Service", render: (row) => row.serviceId?.name || "Service" },
    { key: "quantity", header: "Qty" },
    { key: "charge", header: "Charge", render: (row) => formatCurrency(row.charge) },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-400">Balance, activity, and your latest orders.</p>
        </div>
        <Link to="/new-order" className="btn-primary">
          <PlusCircle size={17} />
          Quick Order
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Wallet Balance" value={formatCurrency(dashboard?.balance)} icon={WalletCards} accent="from-mint to-ocean" />
        <StatCard title="Total Orders" value={dashboard?.stats?.totalOrders || 0} icon={ClipboardList} />
        <StatCard title="Completed" value={dashboard?.stats?.completedOrders || 0} icon={CheckCircle2} accent="from-emerald-500 to-mint" />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-bold">Recent Orders</h2>
        <Table columns={columns} data={dashboard?.recentOrders || []} loading={isLoading} />
      </section>
    </div>
  );
};

export default Dashboard;
