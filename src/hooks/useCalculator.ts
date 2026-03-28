import { useMemo } from 'react';
import type { CostItem, CalculationResult } from '../types';

export const useCalculator = (
    fixedItems: CostItem[],
    opexItems: CostItem[],
    variableItems: CostItem[],
    sellingPrice: number,
    dailyTarget: number
): CalculationResult => {
    return useMemo(() => {
        const totalFixed = fixedItems.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
        const totalOpex = opexItems.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
        const totalVariable = variableItems.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);

        const revenue = sellingPrice * dailyTarget * 30; // Monthly
        // Variable cost per month
        const monthlyVariableCost = totalVariable * dailyTarget * 30;

        const grossProfit = revenue - monthlyVariableCost;
        const netProfit = grossProfit - totalOpex;

        // Margin calculation
        const margin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

        // Daily Net Profit for BEP calculation (Net Profit per day approx)
        // Formula from original: ((price - var) * target) - (opex / 30)
        const dailyNetProfit = ((sellingPrice - totalVariable) * dailyTarget) - (totalOpex / 30);

        // BEP Days (Return of Investment)
        const breakEvenDays = dailyNetProfit > 0 ? Math.ceil(totalFixed / dailyNetProfit) : Infinity;

        // BEP Units (Break Even Point in Units to cover Fixed Costs + Opex is tricky, 
        // usually BEP Unit = Total Fixed / (Price - VarCost), but here we handle monthly Opex too.
        // Original formula: (price - totalV) > 0 ? Math.ceil(totalF / (price - totalV)) : 0;
        // The original formula seems to calculate BEP to cover FIXED costs only, ignoring OPEX? 
        // "side-units" in original code: Math.ceil(totalF / (price - totalV))
        // Let's stick to original logic for consistency, or improve it? 
        // The user migration request implies "optimal", but maybe logic should stay consistent unless asked.
        // Original: const bepUnits = (price - totalV) > 0 ? Math.ceil(totalF / (price - totalV)) : 0;
        const contributionMargin = sellingPrice - totalVariable;
        const breakEvenUnits = contributionMargin > 0 ? Math.ceil(totalFixed / contributionMargin) : 0;

        // Suggestion Logic
        let suggestion = "Analisis akan muncul setelah data dimasukkan.";
        let status: 'PROFIT' | 'LOSS' | 'BEP' = 'BEP';

        if (netProfit < 0) {
            suggestion = "⚠️ <b>Bahaya!</b> Biaya operasional lebih besar dari keuntungan porsi. Naikin harga atau kurangi pengeluaran bulanan.";
            status = 'LOSS';
        } else if (breakEvenDays > 365) {
            suggestion = "⏳ <b>Balik modal lambat.</b> Butuh lebih dari 1 tahun. Coba naikin target harian biar lebih cepet.";
            status = 'PROFIT'; // Technincally profit but slow ROI
        } else if (netProfit > 0) {
            suggestion = "✅ <b>Proyeksi sehat!</b> Pertahanin margin dan fokus gedein volume penjualan.";
            status = 'PROFIT';
        }

        // Chart Data
        // Original: vP, oP, pP relative to Revenue
        // If revenue is 0, avoid division by zero

        return {
            totalFixed,
            totalOpex,
            totalVariable,
            revenue,
            grossProfit,
            netProfit,
            margin,
            dailyNetProfit,
            breakEvenDays,
            breakEvenUnits,
            chartData: {
                revenue,
                variableCost: monthlyVariableCost,
                opex: totalOpex,
                profit: Math.max(0, netProfit),
                fixedCost: totalFixed
            },
            suggestion,
            status
        };
    }, [fixedItems, opexItems, variableItems, sellingPrice, dailyTarget]);
};
