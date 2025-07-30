import { useEffect } from "react";
import { useLeaveStore } from "../../../store/attendance/useLeaveStore.js"; // pastikan path ini benar
import { useAuthStore } from "../../../store/auth/useAuthStore.js";
import { toYMDDate } from "../../../utils/dateFormatter.js";
import { isGetByUsername } from "../../../utils/permissionUser.js";

export default function AdminLeaveApproval() {
  const { leaveRequests, fetchPendingLeaves, approveLeaveRequest, rejectLeaveRequest, error } = useLeaveStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const getJenisCuti = (type) => {
    switch (type) {
      case "Annual":
        return "Cuti Tahunan";
      case "Sick":
        return "Cuti Sakit";
      case "Permission":
        return "Izin";
      default:
        return "-";
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case "Approved":
        return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
      case "Rejected":
        return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Daftar Pengajuan Cuti/Izin</h2>

      {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

      {leaveRequests.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada pengajuan cuti.</p>
      ) : (
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-center">Nama</th>
              <th className="p-2 text-center">Jenis</th>
              <th className="p-2 text-center">Tanggal</th>
              <th className="p-2 text-center">Alasan</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.leave_id} className="border-t">
                <td className="p-2 text-center">{leave.user?.username || "-"}</td>
                <td className="p-2 text-center">{getJenisCuti(leave.type)}</td>
                <td className="p-2 text-center">
                  {toYMDDate(leave.startDate)} s.d {toYMDDate(leave.endDate)}
                </td>
                <td className="p-2 text-center">{leave.reason}</td>
                <td className="p-2 text-center">{getStatusBadge(leave.status)}</td>
                <td className="p-2 space-x-2">
                  {leave.status === "Pending" && isGetByUsername(user?.username) && (
                    <>
                      <button onClick={() => approveLeaveRequest(leave.leave_id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Approve
                      </button>
                      <button onClick={() => rejectLeaveRequest(leave.leave_id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
