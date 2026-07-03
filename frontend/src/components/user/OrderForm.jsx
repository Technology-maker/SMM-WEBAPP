import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { createOrder } from "../../api/orderAPI";
import formatCurrency from "../../utils/formatCurrency";

const OrderForm = ({ service }) => {
  const queryClient = useQueryClient();
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(service?.minOrder || 1);
  const charge = useMemo(() => (service ? ((Number(service.rate) * Number(quantity || 0)) / 1000).toFixed(2) : 0), [service, quantity]);

  const mutation = useMutation(createOrder, {
    onSuccess: (response) => {
      toast.success(response.message || "Order created");
      setLink("");
      setQuantity(service?.minOrder || 1);
      queryClient.invalidateQueries("orders");
      queryClient.invalidateQueries("user:dashboard");
      queryClient.invalidateQueries("auth:me");
    }
  });

  const submit = (event) => {
    event.preventDefault();
    if (!service) return toast.error("Choose a service first");
    mutation.mutate({ serviceId: service._id, link, quantity: Number(quantity) });
  };

  return (
    <form onSubmit={submit} className="glass rounded-lg p-5">
      <div className="mb-5">
        <p className="text-sm text-slate-400">Selected service</p>
        <h2 className="mt-1 text-xl font-bold">{service?.name || "No service selected"}</h2>
        {service && (
          <p className="mt-2 text-sm text-slate-400">
            Rate {formatCurrency(service.rate)} per 1000. Min {service.minOrder}, max {service.maxOrder}.
          </p>
        )}
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">link</span>
          <input className="field" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://..." required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Quantity</span>
          <input
            className="field"
            type="number"
            min={service?.minOrder || 1}
            max={service?.maxOrder || 100000}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </label>
        <div className="rounded-lg border border-line bg-ink/40 p-4">
          <p className="text-sm text-slate-400">Estimated charge</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(charge)}</p>
        </div>
        <button className="btn-primary w-full" disabled={mutation.isLoading || !service}>
          <Send size={17} />
          {mutation.isLoading ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
