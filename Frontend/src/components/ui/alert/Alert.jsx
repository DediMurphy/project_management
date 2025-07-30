import React from "react";
import { Link } from "react-router-dom";

const Alert = ({
                   variant,
                   title,
                   message,
                   showLink = false,
                   linkHref = "#",
                   linkText = "Learn more",
               }) => {
    const variantClasses = {
        success: {
            container:
                "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
            icon: "text-success-500",
        },
        error: {
            container:
                "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
            icon: "text-error-500",
        },
        warning: {
            container:
                "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
            icon: "text-warning-500",
        },
        info: {
            container:
                "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
            icon: "text-blue-light-500",
        },
    };

    const icons = {
        success: (
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.7 12C3.7 7.42 7.42 3.7 12 3.7s8.3 3.72 8.3 8.3-3.72 8.3-8.3 8.3S3.7 16.58 3.7 12Zm4.68-.27c-.35-.35-.35-.91 0-1.26.35-.35.91-.35 1.26 0l1.55 1.55 3.19-3.19c.35-.35.91-.35 1.26 0 .35.35.35.91 0 1.26l-3.82 3.82c-.35.35-.91.35-1.26 0L8.38 11.73Z"
                />
            </svg>
        ),
        error: (
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1.85a10.15 10.15 0 1 0 0 20.3 10.15 10.15 0 0 0 0-20.3ZM13 16.48c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1Zm0-9.1a1 1 0 0 0-2 0v6.68a1 1 0 0 0 2 0V7.38Z"
                />
            </svg>
        ),
        warning: (
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1.85a10.15 10.15 0 1 0 0 20.3 10.15 10.15 0 0 0 0-20.3ZM13 7.53c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1Zm0 9.09a1 1 0 0 0-2 0v-5.68a1 1 0 0 0 2 0v5.68Z"
                />
            </svg>
        ),
        info: (
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1.85a10.15 10.15 0 1 0 0 20.3 10.15 10.15 0 0 0 0-20.3ZM13 7.52c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1Zm0 9.09a1 1 0 0 0-2 0v-5.68a1 1 0 0 0 2 0v5.68Z"
                />
            </svg>
        ),
    };

    return (
        <div className={`rounded-xl border p-4 ${variantClasses[variant].container}`}>
            <div className="flex items-start gap-3">
                <div className={`-mt-0.5 ${variantClasses[variant].icon}`}>
                    {icons[variant]}
                </div>
                <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                    {showLink && (
                        <Link
                            to={linkHref}
                            className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
                        >
                            {linkText}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert;
