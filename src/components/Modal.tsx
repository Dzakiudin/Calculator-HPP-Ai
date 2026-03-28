import React from 'react';
import { Trash2, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    type?: 'hidden' | 'danger' | 'info';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Ya, Lanjut",
    type = 'info'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors",
                    type === 'danger' ? "bg-red-50" : "bg-indigo-50"
                )}>
                    {type === 'danger' ? (
                        <Trash2 className="w-8 h-8 text-red-600" />
                    ) : (
                        <HelpCircle className="w-8 h-8 text-indigo-600" />
                    )}
                </div>

                <h3 className="text-xl font-black text-center mb-2 text-slate-800 tracking-tight">
                    {title}
                </h3>

                <p className="text-center text-slate-500 text-sm leading-relaxed mb-8 px-4">
                    {description}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={cn(
                            "flex-1 py-4 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg",
                            type === 'danger'
                                ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
