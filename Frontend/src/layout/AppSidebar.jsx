import React from "react";
import SidebarWidget from "./SidebarWidget";
import logo from "../assets/logo.png"

import {
    LayoutDashboard,
    FolderKanban,
} from "lucide-react";

const menu = [
    { label: "Dashboard", to: "/", icon: <LayoutDashboard size={20} /> },
    { label: "Projects", to: "/projects", icon: <FolderKanban size={20} /> },
    { label: "Working History", to: "/workLog", icon: <FolderKanban size={20} /> },
    { label: "Absensi", to: "/attendance", icon: <FolderKanban size={20} /> },
    { label: "Pengajuan Izin", to: "/approval-management", icon: <FolderKanban size={20} /> },
];

function AppSidebar() {
    return (
        <div className="w-64 h-full bg-white mt-4 dark:bg-gray-900 border-blue dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-8 text-xl font-bold text-blue-800 dark:text-white">
                <img src={logo} className="h-[50px]"/> <span className="text-center">INTI</span>
            </div>
            <div className="text-start">
                <h3>Menu</h3>
            </div>

            <nav className="space-y-1 mb-8">
                {menu.map((item) => (
                    <SidebarWidget
                        key={item.label}
                        label={item.label}
                        to={item.to}
                        icon={item.icon}
                    />
                ))}
            </nav>
        </div>
    );
}

export default AppSidebar;
