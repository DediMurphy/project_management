import React from "react";
import { NavLink } from "react-router-dom";

function SidebarWidget({ label, to, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 mt-4 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                        ? "bg-blue-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                        : "text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`
            }
        >
            {icon}
            <span>{label}</span>
        </NavLink>

    );
}

export default SidebarWidget;
