import Badge from "../common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const OrderCard = ({ order }) => (
  <div className="glass rounded-lg p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-semibold">{order.serviceId?.name || "Service"}</p>
        <p className="mt-1 max-w-lg truncate text-sm text-slate-400">{order.link}</p>
      </div>
      <Badge status={order.status} />
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
      <div>
        <p className="text-slate-500">Quantity</p>
        <p className="font-semibold">{order.quantity}</p>
      </div>
      <div>
        <p className="text-slate-500">Charge</p>
        <p className="font-semibold">{formatCurrency(order.charge)}</p>
      </div>
      <div>
        <p className="text-slate-500">Remains</p>
        <p className="font-semibold">{order.remains}</p>
      </div>
      <div>
        <p className="text-slate-500">Created</p>
        <p className="font-semibold">{formatDate(order.createdAt)}</p>
      </div>
    </div>
  </div>
);

export default OrderCard;
