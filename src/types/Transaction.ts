export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
    TRANSFER_IN = 'transfer_in',
    TRANSFER_OUT = 'transfer_out'
}

export interface Transaction {
    id: number;
    user_id: number;
    account_id: number;
    category_id: number | null;

    type: TransactionType;
    amount_cents: number;
    description: string | null;
    merchant: string | null;
    transaction_date: Date;

    is_essential: boolean | null;
    is_recurring: boolean;
    ai_tags: string[] | null;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface CreateTransactionDTO {
    account_id: number;
    category_id?: number | null;
    type: TransactionType;
    amount_cents: number;
    description?: string;
    merchant?: string;
    transaction_date: Date | string;
    is_essential?: boolean | null;
    is_recurring?: boolean;
    ai_tags?: string[];
}

export interface UpdateTransactionDTO {
    category_id?: number | null;
    amount_cents?: number;
    description?: string | null;
    merchant?: string | null;
    transaction_date?: Date | string;
    is_essential?: boolean | null;
    is_recurring?: boolean;
    ai_tags?: string[] | null;
}

export interface TransactionResponse {
    id: number;
    user_id: number;
    account_id: number;
    category_id: number | null;
    type: TransactionType;
    amount_cents: number;
    description: string | null;
    merchant: string | null;
    transaction_date: string;
    is_essential: boolean | null;
    is_recurring: boolean;
    ai_tags: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface TransactionListResponse {
    transactions: TransactionResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface TransactionFilters {
    account_id?: number;
    category_id?: number;
    type?: TransactionType;
    start_date?: Date | string;
    end_date?: Date | string;
    is_recurring?: boolean;
    is_essential?: boolean;
    merchant?: string;
    min_amount_cents?: number;
    max_amount_cents?: number;
}

export interface ApiResponse<T> {
    data?: T;
    message: string;
    success: boolean;
    error?: string;
}
