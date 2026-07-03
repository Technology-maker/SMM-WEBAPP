import { useQuery } from "react-query";
import { getNotices } from "../../api/noticeAPI";
import Badge from "../../components/common/Badge";
import formatDate from "../../utils/formatDate";

const noticeStatus = {
  info: "processing",
  warning: "pending",
  success: "success",
  danger: "failed"
};

const Notices = () => {
  const { data, isLoading } = useQuery("notices", getNotices);
  const notices = data?.data?.notices || [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Notices</h1>
        <p className="text-sm text-slate-400">Latest updates and important announcements.</p>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <div className="glass rounded-lg p-4 text-sm text-slate-400">Fetching notices...</div>
        ) : notices.length === 0 ? (
          <div className="glass rounded-lg p-4 text-sm text-slate-400">No notices found.</div>
        ) : (
          notices.map((notice) => (
            <div key={notice._id} className="glass rounded-lg p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-white">{notice.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{formatDate(notice.createdAt)}</p>
                </div>
                <Badge status={noticeStatus[notice.type] || "processing"} label={notice.type} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{notice.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;
