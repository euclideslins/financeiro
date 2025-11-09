export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class DuplicateEmailError extends AppError {
    constructor(email: string) {
        super(`Email ${email} já está cadastrado`, 400);
        Object.setPrototypeOf(this, DuplicateEmailError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} não encontrado`, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
