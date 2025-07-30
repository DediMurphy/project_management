import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <Backdrop show={sidebarOpen} onClick={() => setSidebarOpen(false)} />

            {/* Sidebar */}
            <div
                className={`fixed z-50 md:static inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <AppSidebar />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader onSidebarToggle={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
