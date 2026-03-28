export interface CostItem {
    id: string;
    name: string;
    cost: number;
}

export interface Scenario {
    id?: string;
    title: string;
    fixedItems: CostItem[];
    opexItems: CostItem[];
    variableItems: CostItem[];
    sellingPrice: number;
    dailyTarget: number;
    updatedAt: number;
    userId?: string;
}

export interface CalculationResult {
    totalFixed: number;
    totalOpex: number;
    totalVariable: number;
    revenue: number;
    grossProfit: number;
    netProfit: number;
    margin: number;
    dailyNetProfit: number;
    breakEvenDays: number; // Infinity if never
    breakEvenUnits: number;
    chartData: {
        revenue: number;
        variableCost: number;
        opex: number;
        profit: number;
        fixedCost: number; // for reference
    };
    suggestion: string;
    status: 'PROFIT' | 'LOSS' | 'BEP';
}
