import * as React from "react";

const Spinner = ({ className = "", size = "default" }) => {
    const sizes = {
        sm: "h-4 w-4 border-2",
        default: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    const sizeClass = sizes[size] || sizes.default;

    return (
        <div
            className={`inline-block animate-spin rounded-full border-solid border-blue-600 border-t-transparent ${sizeClass} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

Spinner.displayName = "Spinner";

export { Spinner };
