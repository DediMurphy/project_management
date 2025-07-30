import { useRef, useEffect } from "react";

export const Modal = ({
                          isOpen,
                          onClose,
                          children,
                          className = "",
                          showCloseButton = true,
                          isFullscreen = false,
                      }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContentClass = isFullscreen
        ? "w-full h-full"
        : "relative w-full rounded-3xl bg-white dark:bg-gray-900";

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto">
            {!isFullscreen && (
                <div
                    className="fixed inset-0 bg-gray-400/50 backdrop-blur-[32px]"
                    onClick={onClose}
                />
            )}
            <div
                ref={modalRef}
                className={`${modalContentClass} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 z-[100] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                        aria-label="Close Modal"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.04 16.54a.9.9 0 1 0 1.28 1.28l4.68-4.67 4.68 4.67a.9.9 0 1 0 1.28-1.28l-4.67-4.68 4.67-4.68a.9.9 0 1 0-1.28-1.28l-4.68 4.67-4.68-4.67a.9.9 0 1 0-1.28 1.28l4.67 4.68-4.67 4.68Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                )}
                <div>{children}</div>
            </div>
        </div>
    );
};
