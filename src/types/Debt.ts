export enum DebtStatus {
    ACTIVE = 'active',
    PAID = 'paid',
    RENEGOTIATED = 'renegotiated',
    CANCELLED = 'cancelled'
}

export interface Debt {
    id: number;
    user_id: number;
    name: string;

    total_amount_cents: number;
    paid_amount_cents: number;
    interest_rate: number | null;
    monthly_payment_cents: number | null;

    due_day: number | null;
    status: DebtStatus;
    notes: string | null;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface CreateDebtDTO {
    name: string;
    total_amount_cents: number;
    paid_amount_cents?: number;
    interest_rate?: number | null;
    monthly_payment_cents?: number | null;
    due_day?: number | null;
    notes?: string;
}

export interface UpdateDebtDTO {
    name?: string;
    total_amount_cents?: number;
    paid_amount_cents?: number;
    interest_rate?: number | null;
    monthly_payment_cents?: number | null;
    due_day?: number | null;
    status?: DebtStatus;
    notes?: string | null;
}

export interface DebtResponse {
    id: number;
    user_id: number;
    name: string;
    total_amount_cents: number;
    paid_amount_cents: number;
    remaining_amount_cents: number;
    interest_rate: number | null;
    monthly_payment_cents: number | null;
    due_day: number | null;
    status: DebtStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface DebtStats {
    total_debts: number;
    active_debts: number;
    total_debt_amount_cents: number;
    total_paid_amount_cents: number;
    total_remaining_cents: number;
    monthly_payment_total_cents: number;
    avg_interest_rate: number | null;
}

export interface ApiResponse<T> {
    data?: T;
    message: string;
    success: boolean;
    error?: string;
}
