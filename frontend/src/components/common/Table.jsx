import Loader from "./Loader";

const Table = ({ columns, data = [], loading, empty = "No records found" }) => {
  if (loading) return <Loader label="Fetching records" />;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-400" colSpan={columns.length}>
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id || row.id} className="hover:bg-white/[0.03]">
                  {columns.map((column) => (
                    <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-200">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
