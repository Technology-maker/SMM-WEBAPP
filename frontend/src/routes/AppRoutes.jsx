import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import AdminSidebar from "../components/admin/AdminSidebar";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyOTP from "../pages/user/VerifyOTP";
import ChangePassword from "../pages/user/ChangePassword";
import Contact from "../pages/user/Contact";
import PublicRoute from "../pages/user/PublicRoute.jsx";
import Logout from "../pages/user/Logout.jsx";
import ManualPayment from "../pages/user/ManualPayment";

const Home = lazy(() => import("../pages/public/Home"));
const Login = lazy(() => import("../pages/public/Login"));
const Register = lazy(() => import("../pages/public/Register"));
const Dashboard = lazy(() => import("../pages/user/Dashboard"));
const NewOrder = lazy(() => import("../pages/user/NewOrder"));
const MyOrders = lazy(() => import("../pages/user/MyOrders"));
const Notices = lazy(() => import("../pages/user/Notices"));
const AddFunds = lazy(() => import("../pages/user/AddFunds"));
const Profile = lazy(() => import("../pages/user/Profile"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const ManageOrders = lazy(() => import("../pages/admin/ManageOrders"));
const ManageServices = lazy(() => import("../pages/admin/ManageServices"));
const ManageCategories = lazy(() => import("../pages/admin/ManageCategories"));
const ManageNotices = lazy(() => import("../pages/admin/ManageNotices"));
const Transactions = lazy(() => import("../pages/admin/Transactions"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const Services = lazy(() => import("../pages/user/Services"));
const UserTransactions = lazy(() => import("../pages/user/Transactions"));

const UserLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-bg min-h-screen lg:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/services" element={<Services />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/add-funds" element={<AddFunds />} />
              <Route path="/transactions" element={<UserTransactions />} />
              <Route path="/add-funds/manual" element={<ManualPayment />} />
              <Route path="/add-funds/bhim-upi" element={<ManualPayment title="BHIM UPI Payment" method="bhim_upi" qrImage="/bhim-qr-code.jpeg" />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-bg min-h-screen lg:flex">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="notices" element={<ManageNotices />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>

      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/change-password" element={<ChangePassword />} />


      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminLayout />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<UserLayout />} />
      </Route>

    </Routes>
  </Suspense>
);

export default AppRoutes;
