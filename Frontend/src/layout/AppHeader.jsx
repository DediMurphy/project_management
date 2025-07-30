import React, { useState } from "react";
import { Menu } from "lucide-react";
import ThemeToggleButton from "../components/theme/ThemeToggleButton.jsx";
import { useAuthStore } from "../store/auth/useAuthStore.js";

function AppHeader({ onSidebarToggle }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const username = useAuthStore((state) => state.user.username);

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between md:justify-start gap-4 relative">
            <button onClick={onSidebarToggle} className="md:hidden">
                <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            <h1 className="text-xl font-bold text-gray-800 dark:text-white">PT INTI ANUGERAH TEKNOLOGI INDONESIA</h1>

            <ThemeToggleButton />

            <div className="relative">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="ml-4 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xl"
                >
                    👤
                </button>

                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                        <div className="px-4 py-8 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                {username}
                            </p>
                        </div>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

        </header>
    );
}

export default AppHeader;
