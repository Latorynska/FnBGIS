import { useEffect } from 'react';

const Modal = ({ title, children, onClose, width = 'md', glass = true }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const widthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }[width] || 'max-w-md';

    const modalBaseClass = `rounded-lg w-full ${widthClass} p-6 relative`;

    const glassStyle = {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(5px)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
    };

    const darkStyle = {
        background: "#1e293b", // slate-800
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        color: "white",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className={modalBaseClass}
                style={glass ? glassStyle : darkStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <i className="fas fa-times"></i>
                </button>
                {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
                {children}
            </div>
        </div>
    );
};

export default Modal;
