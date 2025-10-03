export interface Account {
    id: number;
    user_id: number;
    name: string;
    type: 'wallet' | 'current' | 'savings';
    currency_code: string;
    opening_balance_cents: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
}

export interface AccountGetResponse {

    user_id: number;
    name: string;
    type?: 'wallet' | 'current' | 'savings';
    created_at?: Date;
}


export interface AccountResponse {
    id: number;
    user_id: number;
    name: string;
    type: 'wallet' | 'current' | 'savings';
    currency_code: string;
    opening_balance_cents: number;
}

export interface CreateAccountDTO {
    user_id: number;
    name: string;
    type?: 'wallet' | 'current' | 'savings';
    currency_code?: string;
    opening_balance_cents?: number;
}

export interface UpdateAccountDTO {
    name?: string;
    type?: 'wallet' | 'current' | 'savings';
    currency_code?: string;
    opening_balance_cents?: number;
}

export interface ApiResponse<T> {
    data?: T;
    message: string;
    success: boolean;
    error?: string;
}