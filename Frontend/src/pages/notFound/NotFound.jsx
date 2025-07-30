import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
