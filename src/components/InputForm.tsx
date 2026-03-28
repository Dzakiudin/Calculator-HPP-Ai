import React from 'react';
import { Package, Zap, ShoppingBag, X, Save, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CostItem } from '../types';
import { cn } from '../lib/utils';

interface InputFormProps {
    title: string;
    setTitle: (val: string) => void;
    fixedItems: CostItem[];
    setFixedItems: React.Dispatch<React.SetStateAction<CostItem[]>>;
    opexItems: CostItem[];
    setOpexItems: React.Dispatch<React.SetStateAction<CostItem[]>>;
    variableItems: CostItem[];
    setVariableItems: React.Dispatch<React.SetStateAction<CostItem[]>>;
    sellingPrice: number;
    setSellingPrice: (val: number) => void;
    dailyTarget: number;
    setDailyTarget: (val: number) => void;
    onSave: () => void;
    isEditing: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
    title, setTitle,
    fixedItems, setFixedItems,
    opexItems, setOpexItems,
    variableItems, setVariableItems,
    sellingPrice, setSellingPrice,
    dailyTarget, setDailyTarget,
    onSave, isEditing
}) => {

    const handleAddItem = (setter: React.Dispatch<React.SetStateAction<CostItem[]>>) => {
        setter(prev => [...prev, { id: crypto.randomUUID(), name: '', cost: 0 }]);
    };

    const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<CostItem[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateItem = (setter: React.Dispatch<React.SetStateAction<CostItem[]>>, index: number, field: keyof CostItem, value: string | number) => {
        setter(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
    };

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const renderSection = (
        label: string,
        icon: React.ReactNode,
        items: CostItem[],
        setter: React.Dispatch<React.SetStateAction<CostItem[]>>,
        colorClass: string,
        bgClass: string,
        borderClass: string
    ) => {
        const total = items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);

        return (
            <motion.div variants={containerVariants} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-3 text-slate-800 text-lg">
                        <span className={cn("p-2.5 rounded-xl shadow-sm", bgClass)}>{icon}</span>
                        {label}
                    </h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddItem(setter)}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Item
                    </motion.button>
                </div>

                <div className="space-y-3">
                    <AnimatePresence initial={false}>
                        {items.map((item, i) => (
                            <motion.div
                                key={item.id || i}
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex gap-3 items-center group relative"
                            >
                                <div className="flex-1 relative">
                                    <input
                                        value={item.name}
                                        onChange={(e) => handleUpdateItem(setter, i, 'name', e.target.value)}
                                        placeholder="Nama Item..."
                                        className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-medium border border-transparent focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="relative w-36">
                                    <span className="absolute left-4 top-4 text-xs font-bold text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        value={item.cost || ''}
                                        onChange={(e) => handleUpdateItem(setter, i, 'cost', Number(e.target.value))}
                                        className="w-full bg-slate-50 p-4 pl-10 rounded-2xl text-sm text-right font-bold outline-none border border-transparent focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all"
                                    />
                                </div>
                                {items.length > 1 && (
                                    <motion.button
                                        whileHover={{ scale: 1.1, color: '#ef4444' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleRemoveItem(setter, i)}
                                        className="text-slate-300 p-2 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <motion.div
                    layout
                    className={cn("flex justify-between items-center p-5 rounded-2xl border mt-4 backdrop-blur-sm", bgClass, borderClass)}
                >
                    <span className={cn(colorClass, "opacity-70 font-bold text-xs uppercase tracking-wider")}>Total Estimasi</span>
                    <span className={cn("font-black text-lg", colorClass)}>{formatIDR(total)}</span>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white/80 backdrop-blur-xl p-5 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white"
        >
            <div className="mb-10">
                <label className="block text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">Nama Proyek</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Warmindo Kekinian..."
                    className="text-3xl md:text-4xl font-black w-full outline-none bg-transparent border-b-2 border-slate-100 focus:border-indigo-500 pb-4 transition-all text-slate-800 placeholder:text-slate-200"
                />
            </div>

            {renderSection(
                "Investasi Awal",
                <Package className="w-5 h-5 text-indigo-600" />,
                fixedItems, setFixedItems,
                "text-indigo-600", "bg-indigo-50/50", "border-indigo-100/50"
            )}

            {renderSection(
                "Biaya Operasional",
                <Zap className="w-5 h-5 text-blue-600" />,
                opexItems, setOpexItems,
                "text-blue-600", "bg-blue-50/50", "border-blue-100/50"
            )}

            {renderSection(
                "Bahan Baku (HPP)",
                <ShoppingBag className="w-5 h-5 text-emerald-600" />,
                variableItems, setVariableItems,
                "text-emerald-600", "bg-emerald-50/50", "border-emerald-100/50"
            )}

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShoppingBag className="w-24 h-24 text-indigo-600" />
                    </div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Harga Jual / Porsi</label>
                    <div className="relative z-10">
                        <span className="absolute left-0 top-1 text-xl font-bold text-slate-300">Rp</span>
                        <input
                            type="number"
                            value={sellingPrice || ''}
                            onChange={(e) => setSellingPrice(Number(e.target.value))}
                            className="w-full bg-transparent pl-10 pb-2 border-b-2 border-slate-200 focus:border-indigo-500 font-black text-3xl outline-none transition-all"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap className="w-24 h-24 text-indigo-600" />
                    </div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Target Laku / Hari</label>
                    <div className="relative z-10 flex items-baseline gap-2">
                        <input
                            type="number"
                            value={dailyTarget || ''}
                            onChange={(e) => setDailyTarget(Number(e.target.value))}
                            className="w-full bg-transparent pb-2 border-b-2 border-slate-200 focus:border-indigo-500 font-black text-3xl outline-none transition-all"
                            placeholder="0"
                        />
                        <span className="text-sm font-bold text-slate-400">Porsi</span>
                    </div>
                </div>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSave}
                className="w-full mt-10 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-6 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all flex items-center justify-center gap-3 text-lg"
            >
                <Save className="w-6 h-6" />
                {isEditing ? 'PERBARUI ANALISIS' : 'SIMPAN ANALISIS'}
            </motion.button>
        </motion.div>
    );
};
