import React from "react";

export default function AttendanceSummaryUser({ recap }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-green-100 text-green-800 font-semibold py-3 rounded-lg shadow-sm">
                <div className="text-xs dark:text-white">Full Day</div>
                <div className="text-xl dark:text-white">{recap?.fullDay || 0}</div>
            </div>
            <div className="bg-yellow-100 text-yellow-800 font-semibold py-3 rounded-lg shadow-sm">
                <div className="text-xs dark:text-white">Half Day</div>
                <div className="text-xl dark:text-white">{recap?.halfDay || 0}</div>
            </div>
            <div className="bg-orange-100 text-orange-800 font-semibold py-3 rounded-lg shadow-sm">
                <div className="text-xs dark:text-white">Late</div>
                <div className="text-xl dark:text-white">{recap?.late || 0}</div>
            </div>
            <div className="bg-red-100 text-red-800 font-semibold py-3 rounded-lg shadow-sm">
                <div className="text-xs dark:text-white">Absent</div>
                <div className="text-xl dark:text-white">{recap?.absent || 0}</div>
            </div>
        </div>
    );
}
