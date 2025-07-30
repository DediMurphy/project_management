import { useEffect, useState } from "react";
import { useAttendanceStore } from "../../store/attendance/useAttendanceStore";
import { useCheckInOutStore } from "../../store/attendance/useCheckInOutStore.js";
import { useLeaveStore } from "../../store/attendance/useLeaveStore";
import { useRecapStore } from "../../store/attendance/useRecapStore";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import { toHMTime, toYMDDate } from "../../utils/dateFormatter";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { isGetByUsername } from "../../utils/permissionUser.js";

export default function AttendancePage() {
  const { attendances, fetchAttendances, loading, error } = useAttendanceStore();
  const { checkIn, checkOut } = useCheckInOutStore();
  const { submitLeave } = useLeaveStore();
  const { fetchRecap, recap, fetchRecapAll } = useRecapStore();
  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const { user } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [leaveData, setLeaveData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const today = toYMDDate(new Date());
  const todayAttendance = attendances.find((a) => a.checkIn && toYMDDate(new Date(a.checkIn)) === today);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      await fetchAttendances(selectedMonth);
      setAlertInfo({
        variant: "success",
        title: "Check-In Berhasil",
        message: "Absensi kamu hari ini sudah tercatat.",
      });
    } catch {
      setAlertInfo({
        variant: "error",
        title: "Check-In Gagal",
        message: "Coba lagi nanti atau hubungi admin.",
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      await fetchAttendances(selectedMonth);
      setAlertInfo({
        variant: "success",
        title: "Check-Out Berhasil",
        message: "Waktu pulang kamu sudah tercatat.",
      });
    } catch {
      setAlertInfo({
        variant: "error",
        title: "Check-Out Gagal",
        message: "Coba lagi nanti atau hubungi admin.",
      });
    }
  };

  const handleMonthChange = async (newMonth) => {
    setSelectedMonth(newMonth);
    setIsLoading(true);
    try {
      await fetchAttendances(newMonth);
      
      // ✅ Konsisten dengan useEffect logic
      if (user?.role === "admin" || isGetByUsername(user?.username)) {
        await fetchRecapAll(newMonth);
      } else if (user?.user_id) {
        await fetchRecap(user.user_id, newMonth);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = attendances.filter((log) => {
    // Filter berdasarkan user yang dipilih di dropdown (untuk admin)
    const userFilter = selectedUser ? (log.username || log.user?.username) === selectedUser : true;
    
    // Filter berdasarkan permission user
    const permissionFilter = (user?.role === "admin" || isGetByUsername(user?.username)) 
      ? true // Admin/privileged user bisa lihat semua
      : (log.user?.user_id === user?.user_id || log.user_id === user?.user_id); // User biasa hanya lihat data sendiri
    
    return userFilter && permissionFilter;
  });

  // ✅ Consolidated useEffect for initial data loading
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchInitialData = async () => {
      try {
        await fetchAttendances(selectedMonth);
        
        // Admin atau user dengan permission khusus bisa lihat semua
        if (user?.role === "admin" || isGetByUsername(user?.username)) {
          console.log("🔄 Calling fetchRecapAll for admin/privileged user");
          await fetchRecapAll(selectedMonth);
        } else {
          console.log("🔄 Calling fetchRecap for regular user");
          await fetchRecap(user.user_id, selectedMonth);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [user?.user_id, selectedMonth]);

  // ✅ Separate useEffect for user list
  useEffect(() => {
    if (attendances.length > 0) {
      const uniqueUsers = [...new Set(attendances.map(log => log.username || log.user?.username).filter(Boolean))];
      setUserList(uniqueUsers);
    }
  }, [attendances]);

  // ✅ Alert auto-dismiss
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // ✅ Debug recap state
  useEffect(() => {
    console.log("📊 Current recap state:", recap);
  }, [recap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-10 px-4">
      <div className="flex flex-1 items-center justify-center w-full">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Absen Hari Ini</h2>
          {!isGetByUsername(user?.username) && (
            <div className="flex flex-col gap-4">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow disabled:bg-gray-300 disabled:cursor-not-allowed" onClick={handleCheckIn} disabled={!!todayAttendance?.checkIn}>
                {todayAttendance?.checkIn ? `Sudah Check In: ${toHMTime(todayAttendance.checkIn)}` : "Check In"}
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleCheckOut}
                disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
              >
                {todayAttendance?.checkOut ? `Sudah Check Out: ${toHMTime(todayAttendance.checkOut)}` : "Check Out"}
              </Button>

              <div className="mt-4 text-sm text-gray-600 text-center">
                Masuk kerja: <span className="font-semibold text-gray-800">08:00 WIB</span>
                <br />
                Keluar Kerja: <span className="font-semibold text-gray-800">17:00 WIB</span>
                <br />
                Toleransi keterlambatan: <span className="font-semibold text-red-500">maks. 15 menit</span>
                <br />
                Terlambat jika Check In setelah <span className="font-semibold text-red-600">08:15 WIB</span>{" "}
              </div>
            </div>
          )}

          {!isGetByUsername(user?.username) && (
            <div className="mt-6 text-center">
              <button onClick={() => setShowLeave(true)} className="text-yellow-500 hover:underline mt-2">
                Ajukan Cuti/Izin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Cuti */}
      {showLeave && <AttendanceForm leaveData={leaveData} setLeaveData={setLeaveData} onClose={() => setShowLeave(false)} onSubmit={submitLeave} />}

      {/* Alert */}
      {alertInfo && (
        <div className="mb-4 w-full max-w-xl">
          <Alert variant={alertInfo.variant} title={alertInfo.title} message={alertInfo.message} showLink={false} />
        </div>
      )}

      {/* Rekap Kehadiran */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 mt-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 text-center sm:text-left mb-4 sm:mb-0">
            Rekap Kehadiran Bulanan
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium">Pilih Bulan:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="border rounded px-2 py-1"
                disabled={isLoading}
              />
            </div>
            {/* Hanya tampilkan dropdown user untuk admin/privileged user */}
            {(user?.role === "admin" || isGetByUsername(user?.username)) && (
              <div className="flex items-center">
                <h3 className="mr-2 text-sm font-medium">Pengguna:</h3>
                <select
                  className="rounded-lg border px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-white"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Semua User</option>
                  {userList.map((userOption, idx) => (
                    <option key={idx} value={userOption}>
                      {userOption}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {(loading || isLoading) && <p className="text-center text-sm text-gray-500">Memuat data...</p>}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        {recap && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-green-100 text-green-800 font-semibold py-3 rounded-lg shadow-sm">
              <div className="text-xs">Full Day</div>
              <div className="text-xl">{recap.fullDay || 0}</div>
            </div>
            <div className="bg-yellow-100 text-yellow-800 font-semibold py-3 rounded-lg shadow-sm">
              <div className="text-xs">Half Day</div>
              <div className="text-xl">{recap.halfDay || 0}</div>
            </div>
            <div className="bg-orange-100 text-orange-800 font-semibold py-3 rounded-lg shadow-sm">
              <div className="text-xs">Late</div>
              <div className="text-xl">{recap.late || 0}</div>
            </div>
            <div className="bg-red-100 text-red-800 font-semibold py-3 rounded-lg shadow-sm">
              <div className="text-xs">Absent</div>
              <div className="text-xl">{recap.absent || 0}</div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 font-semibold">User Name</th>
                <th className="px-4 py-2 font-semibold">Tanggal</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold">Check In</th>
                <th className="px-4 py-2 font-semibold">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{row.user?.username}</td>
                  <td className="py-2">{toYMDDate(row.date)}</td>
                  <td className={row.status === "Late" ? "text-yellow-600 font-bold" : row.status === "Absent" ? "text-red-600 font-bold" : "text-green-600 font-bold"}>{row.status}</td>
                  <td className="py-2">{row.checkIn ? toHMTime(row.checkIn) : "-"}</td>
                  <td className="py-2">{row.checkOut ? toHMTime(row.checkOut) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}