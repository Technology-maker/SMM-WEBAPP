import { useState } from "react";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { updateProfile } from "../../api/authAPI";
import useAuth from "../../hooks/useAuth";
import formatCurrency from "../../utils/formatCurrency";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", password: "" });

  const mutation = useMutation(updateProfile, {
    onSuccess: (response) => {
      setUser(response.data.user);
      setForm((value) => ({ ...value, password: "" }));
      toast.success("Profile updated");
    }
  });

  const submit = (event) => {
    event.preventDefault();
    const payload = { name: form.name };
    if (form.password) payload.password = form.password;
    mutation.mutate(payload);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="glass rounded-lg p-5">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="mt-6 space-y-4">
          <label>
            <span className="mb-2 block text-sm font-medium">Name</span>
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium">New password</span>
            <input className="field" type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Leave blank to keep current password" />
          </label>
          <button className="btn-primary" disabled={mutation.isLoading}>
            <Save size={17} />
            {mutation.isLoading ? "Saving" : "Save Changes"}
          </button>
        </div>
      </form>
      <aside className="glass rounded-lg p-5">
        <h2 className="text-lg font-bold">Account</h2>
        <div className="mt-4 space-y-3 text-sm">
          <p><span className="text-slate-500">Email:</span> {user?.email}</p>
          <p><span className="text-slate-500">Role:</span> {user?.role}</p>
          <p><span className="text-slate-500">Balance:</span> {formatCurrency(user?.balance)}</p>
          <p className="break-all"><span className="text-slate-500">API key:</span> {user?.apiKey}</p>
        </div>
      </aside>
    </div>
  );
};

export default Profile;
