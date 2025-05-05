import React from 'react';

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="rounded-lg w-full max-w-md p-6 relative"
                style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
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
