import React from "react";

export default function AttendanceForm({ leaveData, setLeaveData, onClose, onSubmit }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(leaveData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg relative">
                <button
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h3 className="text-lg font-bold mb-4">Form Pengajuan Cuti/Izin</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-600 mb-1">Jenis</label>
                        <select
                            className="w-full rounded-lg border border-gray-300 p-2"
                            value={leaveData.type}
                            onChange={(e) =>
                                setLeaveData((ld) => ({ ...ld, type: e.target.value }))
                            }
                            required
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="Annual">Cuti Tahunan</option>
                            <option value="Sick">Cuti Sakit</option>
                            <option value="Permission">Izin</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Tanggal Mulai</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border p-2"
                                value={leaveData.startDate}
                                onChange={(e) =>
                                    setLeaveData((ld) => ({ ...ld, startDate: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Tanggal Selesai</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border p-2"
                                value={leaveData.endDate}
                                onChange={(e) =>
                                    setLeaveData((ld) => ({ ...ld, endDate: e.target.value }))
                                }
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Alasan</label>
                        <textarea
                            className="w-full rounded-lg border p-2"
                            value={leaveData.reason}
                            onChange={(e) =>
                                setLeaveData((ld) => ({ ...ld, reason: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-semibold transition"
                    >
                        Ajukan Cuti/Izin
                    </button>
                </form>
            </div>
        </div>
    );
}
