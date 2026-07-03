import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, LogOut, ShieldCheck } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {AnimatedTitle} from "../common/AnimatedTitle"


const Navbar = ({ onMenu }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [light, setLight] = useState(() => document.documentElement.classList.contains("light"));

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    document.documentElement.classList.toggle("dark", !light);
    localStorage.setItem("theme", light ? "light" : "dark");
  }, [light]);

  const title = location.pathname.startsWith("/admin") ? "Admin Console" : "Welcome";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/85 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={onMenu} aria-label="Open navigation">
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs uppercase text-slate-500">{title}</p>
            {/* <h1 className="text-lg font-bold">{user?.name || "SMM Pulse"}</h1> */}
            <AnimatedTitle text={user?.name || "SMM Pulse"} />
            {/* <AnimatedTitle className="text-lg font-bold" text={user?.name || "SMM Pulse"} /> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-secondary hidden sm:inline-flex">
              <ShieldCheck size={16} />
              Admin
            </Link>
          )}
          <button className="rounded-lg border border-line bg-panelSoft p-2" onClick={() => setLight((value) => !value)} aria-label="Toggle theme">
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user && (
            <button className="rounded-lg border border-line bg-panelSoft p-2" onClick={logout} aria-label="Logout">
               <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
