import { useState } from "react";
import { useQuery } from "react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMyTransactions } from "../../api/paymentAPI";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const Transactions = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");

    const { data, isLoading } = useQuery(
        ["my-transactions", page, status],
        () => getMyTransactions({ page, limit: 10, status: status || undefined })
    );

    const transactions = data?.data?.transactions || [];
    const pages = data?.data?.pages || 1;

    const columns = [
        { key: "reference", header: "Reference" },
        { key: "type", header: "Type" },
        { key: "method", header: "Method" },
        { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
        { key: "utr", header: "UTR", render: (row) => row.utr || "—" },
        { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
        { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) }
    ];

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold">Transactions</h1>
                <p className="text-sm text-slate-400">All your deposits and wallet activity.</p>
            </div>

            <div className="glass grid gap-3 rounded-lg p-4 md:grid-cols-[200px_1fr]">
                <select
                    className="field"
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            <Table columns={columns} data={transactions} loading={isLoading} />

            <div className="flex items-center justify-end gap-2">
                <button
                    className="btn-secondary px-3"
                    disabled={page <= 1}
                    onClick={() => setPage((value) => Math.max(value - 1, 1))}
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-slate-400">Page {page} of {pages}</span>
                <button
                    className="btn-secondary px-3"
                    disabled={page >= pages}
                    onClick={() => setPage((value) => value + 1)}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Transactions;