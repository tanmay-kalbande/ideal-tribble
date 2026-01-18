import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Match animation duration
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 size={18} className="text-green-400" />;
            case 'error': return <AlertCircle size={18} className="text-red-400" />;
            case 'warning': return <AlertTriangle size={18} className="text-orange-400" />;
            case 'info':
            default: return <Info size={18} className="text-blue-400" />;
        }
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'success': return 'border-green-500/30 bg-green-500/10 text-green-100';
            case 'error': return 'border-red-500/30 bg-red-500/10 text-red-100';
            case 'warning': return 'border-orange-500/30 bg-orange-500/10 text-orange-100';
            case 'info':
            default: return 'border-blue-500/30 bg-blue-500/10 text-blue-100';
        }
    };

    return (
        <div
            className={`fixed bottom-8 right-8 z-[150] px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[90vw] transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100'
                } ${getTypeStyles()}`}
            style={{ animation: isExiting ? 'none' : 'toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
            <div className="shrink-0">{getIcon()}</div>
            <div className="flex-1 text-sm font-medium pr-2">{message}</div>
            <button
                onClick={handleClose}
                className="shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
            >
                <X size={14} />
            </button>
        </div>
    );
};

// CSS for animations needs to be in index.css
