import statusColor from "../../utils/statusColor";

const Badge = ({ status, label }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusColor(status)}`}>
    {label || status}
  </span>
);

export default Badge;
