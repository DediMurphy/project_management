import React from "react";
import { formatDateTimeIndo } from "../../../../utils/dateFormatter";

const RecentActivityFeed = ({ activities }) => {
    const formatActivityDate = (act) => {
        if (act.type === "worklog") {
            return new Date(act.timestamp).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }

        return formatDateTimeIndo(act.timestamp);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                {activities && activities.length > 0 ? (
                    activities.slice(0, 5).map((act, index) => (
                        <li
                            key={`${index}-${act.timestamp}-${act.message}`}
                            className="flex items-start"
                        >
              <span
                  className={`w-2 h-2 mt-2 mr-3 rounded-full ${
                      act.type === "attendance"
                          ? "bg-blue-500"
                          : act.type === "leave"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                  }`}
              ></span>
                            <div>
                                <p className="font-medium">
                                    {act.username} - {act.message}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {formatActivityDate(act)}
                                </p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">Belum ada aktivitas.</p>
                )}
            </ul>
        </div>
    );
};

export default RecentActivityFeed;
