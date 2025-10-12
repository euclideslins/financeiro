export interface Category {
    id: number;
    user_id: number;
    name: string;
    kind: KindEnum;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
}

export interface KindEnum {
    kind: 'income' | 'expense';
}