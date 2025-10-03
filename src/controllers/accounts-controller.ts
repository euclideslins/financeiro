import { Request, Response } from "express";
import { CreateAccountService } from "../services/Accounts/create-account.service";
import { GetAccountService } from "../services/Accounts/get-account.service";
import { UpdateAccountService } from "../services/Accounts/update-account.service";
import { ApiResponse } from "../types/User";

export class AccountsController {
    private createAccountService: CreateAccountService;
    private getAccountService: GetAccountService;
    private updateAccountService: UpdateAccountService
    constructor() {
        this.createAccountService = new CreateAccountService();
        this.getAccountService = new GetAccountService();
        this.updateAccountService = new UpdateAccountService();
    }

    getAllAccounts = async (req: Request, res: Response) => {
        try {
            const accounts = await this.getAccountService.getAllAccounts();
            const response: ApiResponse<typeof accounts> = {
                data: accounts,
                message: 'Accounts retrieved successfully',
                success: true
            };
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in getAllAccounts:', error);
            throw error;
        }
    }

    getAccountById = async (req: Request, res: Response) => {
        const accountId = parseInt(req.params.id);
        try {
            if (isNaN(accountId)) {
                const response: ApiResponse<null> = {
                    message: 'Invalid account ID',
                    success: false,
                    error: 'Account ID must be a number'
                };
                res.status(400).json(response);
                return;
            }
            const account = await this.getAccountService.getAccountById(accountId);
            const response: ApiResponse<typeof account> = {
                data: account,
                message: 'Account retrieved successfully',
                success: true
            };
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in getAccountById:', error);
            throw error;
        }
    }

    createAccountForUser = async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        try {

            if (isNaN(userId)) {
                const response: ApiResponse<null> = {
                    message: 'Invalid user ID',
                    success: false,
                    error: 'User ID must be a number'
                };
                res.status(400).json(response);
                return;
            }
            const account = await this.createAccountService.createAccount(userId);

            const response: ApiResponse<typeof account> = {
                data: account,
                message: 'Account created successfully',
                success: true
            };


            res.status(201).json(response);
        } catch (error) {
            console.error('Error in createAccountForUser:', error);
            throw error;
        }
    }

    updateAccount = async (req: Request, res: Response) => {
        const accountId = parseInt(req.params.id);

        if (isNaN(accountId)) {
            const response: ApiResponse<null> = {
                message: 'Invalid account ID',
                success: false,
                error: 'Account ID must be a number'
            };
            res.status(400).json(response);
            return;
        }
        this.updateAccountService.updateAccountName(accountId, req.body.name);
        res.status(200).json({ message: 'Account updated successfully' });
    }


}
