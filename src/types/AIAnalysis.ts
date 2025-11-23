export enum AnalysisType {
    MONTHLY_SUMMARY = 'monthly_summary',
    DEBT_PLAN = 'debt_plan',
    SAVINGS_TIPS = 'savings_tips',
    SPENDING_ALERT = 'spending_alert'
}

export interface AIAnalysis {
    id: number;
    user_id: number;

    analysis_type: AnalysisType;
    period_start: Date;
    period_end: Date;

    summary_text: string;
    insights: AnalysisInsights;
    recommendations: AnalysisRecommendations;
    metrics: AnalysisMetrics | null;

    model_used: string;
    tokens_used: number | null;
    processing_time_ms: number | null;

    created_at: Date;
}

export interface AnalysisInsights {
    top_spending_categories?: Array<{
        category_name: string;
        amount_cents: number;
        percentage: number;
    }>;
    spending_patterns?: string[];
    recurring_expenses?: Array<{
        merchant: string;
        amount_cents: number;
        frequency: string;
    }>;
    unusual_transactions?: Array<{
        date: string;
        merchant: string;
        amount_cents: number;
        reason: string;
    }>;
    [key: string]: any;
}

export interface AnalysisRecommendations {
    priority_actions?: Array<{
        action: string;
        impact: 'high' | 'medium' | 'low';
        potential_savings_cents?: number;
    }>;
    budget_adjustments?: Array<{
        category: string;
        current_cents: number;
        suggested_cents: number;
        reason: string;
    }>;
    debt_strategy?: {
        method: 'snowball' | 'avalanche' | 'custom';
        payment_order: Array<{
            debt_name: string;
            priority: number;
            reason: string;
        }>;
        estimated_payoff_months?: number;
    };
    savings_opportunities?: string[];
    [key: string]: any;
}

export interface AnalysisMetrics {
    total_income_cents?: number;
    total_expense_cents?: number;
    net_balance_cents?: number;
    savings_rate_percentage?: number;
    avg_daily_expense_cents?: number;
    expense_by_category?: Record<string, number>;
    essential_vs_nonessential?: {
        essential_cents: number;
        nonessential_cents: number;
    };
    [key: string]: any;
}

export interface CreateAnalysisDTO {
    analysis_type: AnalysisType;
    period_start: Date | string;
    period_end: Date | string;
    options?: {
        include_predictions?: boolean;
        focus_areas?: string[];
        depth?: 'basic' | 'detailed';
    };
}

export interface AIAnalysisResponse {
    id: number;
    user_id: number;
    analysis_type: AnalysisType;
    period_start: string;
    period_end: string;
    summary_text: string;
    insights: AnalysisInsights;
    recommendations: AnalysisRecommendations;
    metrics: AnalysisMetrics | null;
    model_used: string;
    created_at: string;
}

export interface AnalysisHistoryResponse {
    analyses: AIAnalysisResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface MonthlyAnalysisPromptData {
    user_name: string;
    period: {
        start: string;
        end: string;
    };
    transactions: Array<{
        date: string;
        type: string;
        category: string;
        merchant: string | null;
        amount_cents: number;
        is_essential: boolean | null;
    }>;
    summary: {
        total_income_cents: number;
        total_expense_cents: number;
        balance_cents: number;
    };
}

export interface DebtPlanPromptData {
    user_name: string;
    debts: Array<{
        name: string;
        total_amount_cents: number;
        paid_amount_cents: number;
        remaining_cents: number;
        interest_rate: number | null;
        monthly_payment_cents: number | null;
    }>;
    monthly_income_cents: number;
    monthly_expenses_cents: number;
    available_for_debt_cents: number;
}

export interface SavingsPromptData {
    user_name: string;
    period: {
        start: string;
        end: string;
    };
    expense_by_category: Record<string, number>;
    recurring_expenses: Array<{
        merchant: string;
        amount_cents: number;
        frequency: number;
    }>;
    non_essential_expenses_cents: number;
}

export interface ApiResponse<T> {
    data?: T;
    message: string;
    success: boolean;
    error?: string;
}
