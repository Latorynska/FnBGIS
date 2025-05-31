const Pill = ({ status, text }) => {
    const statusStyles = {
        active: {
            label: "Active",
            className: "bg-emerald-500/20 text-emerald-400",
        },
        warning: {
            label: "Warning",
            className: "bg-yellow-500/20 text-yellow-400",
        },
        critical: {
            label: "Critical",
            className: "bg-red-500/20 text-red-400",
        },
        default: {
            label: "Unknown",
            className: "bg-gray-500/20 text-gray-300",
        },
    };
    const { label, className } = statusStyles[status] || statusStyles.default;

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${className}`}>
            {text ? text : label}
        </span>
    );
};

export default Pill;
