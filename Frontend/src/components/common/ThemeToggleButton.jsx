import { useTheme } from "../../context/ThemeContext";

const ThemeToggleButton = () => {
    const { toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
            {/* Icon untuk mode gelap */}
            <svg
                className="hidden dark:block"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="..." // (biarkan seperti aslinya)
                    fill="currentColor"
                />
            </svg>

            {/* Icon untuk mode terang */}
            <svg
                className="dark:hidden"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="..." // (biarkan seperti aslinya)
                    fill="currentColor"
                />
            </svg>
        </button>
    );
};

export default ThemeToggleButton;
