import { NavLink } from "react-router-dom";
import { BarChart3, Users, ShoppingCart, Boxes, FolderTree, Bell, Receipt, Settings, X } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/services", label: "Services", icon: Boxes },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/notices", label: "Notices", icon: Bell },
  { to: "/admin/transactions", label: "Transactions", icon: Receipt },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];

const AdminSidebar = ({ open, onClose }) => (
  <>
    <div className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-ink px-4 py-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between">
        <NavLink to="/admin" className="text-xl font-black tracking-tight">
          SMM<span className="text-ember">Admin</span>
        </NavLink>
        <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close navigation">
          <X size={18} />
        </button>
      </div>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-gradient-to-r from-ember to-brand text-white" : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default AdminSidebar;
