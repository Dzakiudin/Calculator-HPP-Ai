import React from 'react';
import { motion } from 'framer-motion';
import type { CalculationResult } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
    results: CalculationResult;
}

export const Sidebar: React.FC<SidebarProps> = ({ results }) => {
    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const {
        netProfit,
        margin,
        breakEvenDays,
        breakEvenUnits,
        chartData,
        suggestion,
        status
    } = results;

    // Chart Percentages
    const total = chartData.revenue || 1;
    const vP = Math.max(0, (chartData.variableCost / total) * 100);
    const oP = Math.max(0, (chartData.opex / total) * 100);
    const pP = Math.max(0, (chartData.profit / total) * 100);

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, delay: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <motion.div
                    layout
                    className={cn(
                        "p-6 md:p-8 text-white text-center transition-colors duration-500 relative overflow-hidden",
                        status === 'LOSS' ? "bg-slate-800" : "bg-gradient-to-br from-emerald-500 to-teal-600"
                    )}
                >
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-2">Status Proyeksi</p>
                        <motion.h4
                            key={status}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black uppercase tracking-tight"
                        >
                            {status === 'LOSS' ? 'BELUM UNTUNG' : 'UNTUNG BESAR'}
                        </motion.h4>
                    </div>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                </motion.div>

                <div className="p-6 lg:p-8 space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Net Laba / Bln</p>
                            <motion.p
                                key={netProfit}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-black text-slate-800"
                            >
                                {formatIDR(netProfit)}
                            </motion.p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Margin</p>
                            <motion.p
                                key={margin}
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="font-bold text-xl text-indigo-600"
                            >
                                {margin}%
                            </motion.p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={cardVariants} className="bg-slate-50 p-5 rounded-3xl border border-slate-100/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Balik Modal</p>
                            <p className="font-black text-indigo-600 text-lg">
                                {breakEvenDays === Infinity ? 'N/A' : `${breakEvenDays} Hari`}
                            </p>
                        </motion.div>
                        <motion.div variants={cardVariants} className="bg-slate-50 p-5 rounded-3xl border border-slate-100/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Target BEP</p>
                            <p className="font-black text-slate-700 text-sm">{breakEvenUnits} Porsi</p>
                        </motion.div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex flex-col items-center text-center">
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                                {/* Variable Cost - Green */}
                                <motion.circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                                    pathLength={100}
                                    initial={{ strokeDasharray: "0 100" }}
                                    animate={{ strokeDasharray: `${vP} 100` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                                {/* Opex - Blue */}
                                <motion.circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round"
                                    pathLength={100}
                                    initial={{ strokeDasharray: "0 100", strokeDashoffset: 0 }}
                                    animate={{ strokeDasharray: `${oP} 100`, strokeDashoffset: -vP }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                />
                                {/* Profit - Indigo */}
                                <motion.circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent" stroke="#6366f1" strokeWidth="8" strokeLinecap="round"
                                    pathLength={100}
                                    initial={{ strokeDasharray: "0 100", strokeDashoffset: 0 }}
                                    animate={{ strokeDasharray: `${pP} 100`, strokeDashoffset: -(vP + oP) }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Profit</span>
                                <motion.span
                                    key={pP}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-3xl font-black text-slate-800"
                                >
                                    {pP.toFixed(0)}%
                                </motion.span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm"
            >
                <div
                    className="text-sm text-indigo-900/80 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: suggestion }}
                />
            </motion.div>
        </motion.div>
    );
};
