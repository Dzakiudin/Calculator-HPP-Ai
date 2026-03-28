import React from 'react';
import { Edit2, Trash, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Scenario } from '../types';

interface HistoryProps {
    scenarios: Scenario[];
    onEdit: (scenario: Scenario) => void;
    onDelete: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ scenarios, onEdit, onDelete }) => {
    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (scenarios.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-slate-400"
            >
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Archive className="w-12 h-12 opacity-20" />
                </div>
                <p className="text-sm font-medium tracking-wide">Belum ada skenario tersimpan</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Analisis</h2>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">{scenarios.length} Skenario</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {scenarios.map((s) => {
                        // Quick Recalculation for Card Display
                        const totalOpex = s.opexItems.reduce((a, c) => a + (Number(c.cost) || 0), 0);
                        const totalVariable = s.variableItems.reduce((a, c) => a + (Number(c.cost) || 0), 0);
                        const totalFixed = s.fixedItems.reduce((a, c) => a + (Number(c.cost) || 0), 0);

                        const grossPerUnit = (s.sellingPrice || 0) - totalVariable;
                        const monthlyProfit = (grossPerUnit * (s.dailyTarget || 0) * 30) - totalOpex;

                        const dailyNetProfit = (grossPerUnit * (s.dailyTarget || 0)) - (totalOpex / 30);
                        const breakEvenDays = dailyNetProfit > 0 ? Math.ceil(totalFixed / dailyNetProfit) : 'N/A';

                        return (
                            <motion.div
                                key={s.id}
                                variants={itemVariants}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group cursor-default relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <h3 className="font-bold text-slate-800 line-clamp-1 text-lg group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                            {new Date(s.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onEdit(s)}
                                            className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => s.id && onDelete(s.id)}
                                            className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Laba Bersih</span>
                                        <span className={`font-black text-lg ${monthlyProfit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {formatIDR(monthlyProfit)}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">BEP</span>
                                        <span className="text-sm font-black text-indigo-600">
                                            {breakEvenDays} <span className="text-[10px] font-normal text-slate-400">Hari</span>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
