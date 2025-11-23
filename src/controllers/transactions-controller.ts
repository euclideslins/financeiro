import { NextFunction, Request, Response } from "express";
import { GetUserTransactionsService } from "../services/Transactions/getUserTransactions.service";

export class TransactionsController {

    private getUserTransactionsService: GetUserTransactionsService;
    constructor() {
        this.getUserTransactionsService = new GetUserTransactionsService();
    }

    createTransaction() {
        // Lógica para criar uma transação
    }
    getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const transactions = await this.getUserTransactionsService.getUserTransactions(Number(user_id));
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }
    updateTransaction() {
        // Lógica para atualizar uma transação
    }
    deleteTransaction() {
        // Lógica para deletar uma transação
    }
}