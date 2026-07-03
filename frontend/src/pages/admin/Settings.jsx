import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { getSettings, updateSettings } from "../../api/serviceAPI";
import Loader from "../../components/common/Loader";

const Settings = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("admin:settings", getSettings);
  const [form, setForm] = useState({ siteName: "", currency: "INR", minDeposit: 100, maintenanceMode: false, supportEmail: "", providerMarkupPercent: 25 });

  useEffect(() => {
    if (data?.data?.settings) setForm(data.data.settings);
  }, [data]);

  const mutation = useMutation(updateSettings, {
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries("admin:settings");
    }
  });

  if (isLoading) return <Loader label="Loading settings" />;

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate({
      siteName: form.siteName,
      currency: form.currency,
      minDeposit: Number(form.minDeposit),
      maintenanceMode: Boolean(form.maintenanceMode),
      supportEmail: form.supportEmail,
      providerMarkupPercent: Number(form.providerMarkupPercent)
    });
  };

  return (
    <form onSubmit={submit} className="glass max-w-3xl rounded-lg p-5">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium">Site name</span>
          <input className="field" value={form.siteName || ""} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Currency</span>
          <input className="field" value={form.currency || ""} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Minimum deposit</span>
          <input className="field" type="number" min="1" value={form.minDeposit || 0} onChange={(e) => setForm({ ...form, minDeposit: e.target.value })} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Provider markup percent</span>
          <input className="field" type="number" min="0" value={form.providerMarkupPercent || 0} onChange={(e) => setForm({ ...form, providerMarkupPercent: e.target.value })} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">Support email</span>
          <input className="field" type="email" value={form.supportEmail || ""} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.maintenanceMode)} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} /> Maintenance mode</label>
      </div>
      <button className="btn-primary mt-6" disabled={mutation.isLoading}><Save size={17} /> Save Settings</button>
    </form>
  );
};

export default Settings;
