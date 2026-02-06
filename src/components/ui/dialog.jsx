import * as React from "react";

const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => onOpenChange?.(false)}
            />
            <div className="relative z-50">{children}</div>
        </div>
    );
};

const DialogTrigger = ({ children, asChild, ...props }) => {
    if (asChild) {
        return React.cloneElement(children, props);
    }
    return <button {...props}>{children}</button>;
};

const DialogContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-lg ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className = "", ...props }) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className = "", ...props }) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className = "", ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className = "", ...props }, ref) => (
    <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
