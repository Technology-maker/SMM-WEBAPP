import { useQuery } from "react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign, ShoppingCart, Users, Clock } from "lucide-react";
import { getAdminDashboard } from "../../api/serviceAPI";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import formatCurrency from "../../utils/formatCurrency";

/* ── Custom tooltip for Top Services bar chart ── */
const ServiceTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, orders, revenue } = payload[0].payload;

  // Truncate long provider service names
  const shortName = name?.length > 35 ? name.slice(0, 35) + "…" : name;

  return (
    <div style={{
      background: "#181826",
      border: "1px solid #303044",
      borderRadius: 8,
      padding: "10px 14px",
      maxWidth: 220,
      wordBreak: "break-word",
      fontSize: 12,
      lineHeight: 1.6,
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
    }}>
      <p style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 6, fontSize: 12 }}>
        {shortName}
      </p>
      <p style={{ color: "#94a3b8", margin: 0 }}>
        Orders: <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{orders}</span>
      </p>
      {revenue !== undefined && (
        <p style={{ color: "#94a3b8", margin: 0 }}>
          Revenue: <span style={{ color: "#14b8a6", fontWeight: 600 }}>{formatCurrency(revenue)}</span>
        </p>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { data, isLoading } = useQuery("admin:dashboard", getAdminDashboard);
  const payload = data?.data;

  if (isLoading) return <Loader label="Loading admin dashboard" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">System-wide growth, revenue, and service performance.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Users" value={payload?.stats?.users || 0} icon={Users} />
        <StatCard title="Orders" value={payload?.stats?.orders || 0} icon={ShoppingCart} accent="from-ocean to-mint" />
        <StatCard title="Pending" value={payload?.stats?.pendingOrders || 0} icon={Clock} accent="from-amber-500 to-ember" />
        <StatCard title="Revenue" value={formatCurrency(payload?.stats?.revenue)} icon={DollarSign} accent="from-emerald-500 to-mint" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold">Orders per day</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payload?.charts?.ordersPerDay || []}>
                <defs>
                  <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#303044" strokeDasharray="3 3" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#181826", border: "1px solid #303044" }} />
                <Area type="monotone" dataKey="orders" stroke="#14b8a6" fill="url(#orders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold">Top services</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={payload?.charts?.topServices || []}
                margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
              >
                <CartesianGrid stroke="#303044" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" hide />
                <YAxis stroke="#94a3b8" width={32} />
                <Tooltip
                  content={<ServiceTooltip />}
                  cursor={{ fill: "rgba(124,58,237,0.08)" }}
                  position={{ y: 0 }}
                  allowEscapeViewBox={{ x: false, y: true }}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Bar dataKey="orders" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;