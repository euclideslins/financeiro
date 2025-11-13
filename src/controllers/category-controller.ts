import { NextFunction, Request, Response } from "express";
import { CreateCategoryService } from "../services/Category/create-category.service";
import { DeleteCategoryService } from "../services/Category/delete-category.service";
import { GetCategoryService } from "../services/Category/get-category.service";
import { UpdateCategoryService } from "../services/Category/update-category.service";
import { ApiResponse } from "../types/User";

export class CategoryController {
    private createCategoryService: CreateCategoryService;
    private getCategoryService: GetCategoryService;
    private updateCategoryService: UpdateCategoryService;
    private deleteCategoryService: DeleteCategoryService;

    constructor() {
        this.createCategoryService = new CreateCategoryService();
        this.getCategoryService = new GetCategoryService();
        this.updateCategoryService = new UpdateCategoryService();
        this.deleteCategoryService = new DeleteCategoryService();
    }

    createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, kind, parent_id } = req.body;
            const user_id = req.user?.data?.id;

            if (!user_id) {
                const response: ApiResponse<null> = {
                    message: 'User ID is required',
                    success: false,
                    error: 'User must be authenticated'
                };
                res.status(401).json(response);
                return;
            }

            const category = await this.createCategoryService.createCategory(name, kind, parent_id || null, user_id);

            const response: ApiResponse<typeof category> = {
                data: category,
                message: 'Category created successfully',
                success: true
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    getAllCategoriesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user_id = Number(req.params.user_id);

            if (isNaN(user_id)) {
                const response: ApiResponse<null> = {
                    message: 'Invalid user ID',
                    success: false,
                    error: 'User ID must be a number'
                };
                res.status(400).json(response);
                return;
            }

            const categories = await this.getCategoryService.getAllCategoriesByUser(user_id);

            const response: ApiResponse<typeof categories> = {
                data: categories,
                message: 'Categories retrieved successfully',
                success: true
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                const response: ApiResponse<null> = {
                    message: 'Invalid category ID',
                    success: false,
                    error: 'Category ID must be a number'
                };
                res.status(400).json(response);
                return;
            }

            const category = await this.getCategoryService.getCategoryById(id);

            if (!category) {
                const response: ApiResponse<null> = {
                    message: 'Category not found',
                    success: false,
                    error: 'No category found with the provided ID'
                };
                res.status(404).json(response);
                return;
            }

            const response: ApiResponse<typeof category> = {
                data: category,
                message: 'Category retrieved successfully',
                success: true
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { name, kind } = req.body;

            if (isNaN(id)) {
                const response: ApiResponse<null> = {
                    message: 'Invalid category ID',
                    success: false,
                    error: 'Category ID must be a number'
                };
                res.status(400).json(response);
                return;
            }

            const category = await this.updateCategoryService.updateCategory(id, name, kind);

            if (!category) {
                const response: ApiResponse<null> = {
                    message: 'Category not found',
                    success: false,
                    error: 'No category found with the provided ID'
                };
                res.status(404).json(response);
                return;
            }

            const response: ApiResponse<typeof category> = {
                data: category,
                message: 'Category updated successfully',
                success: true
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                const response: ApiResponse<null> = {
                    message: 'Invalid category ID',
                    success: false,
                    error: 'Category ID must be a number'
                };
                res.status(400).json(response);
                return;
            }

            const deleted = await this.deleteCategoryService.deleteCategory(id);

            if (!deleted) {
                const response: ApiResponse<null> = {
                    message: 'Category not found',
                    success: false,
                    error: 'No category found with the provided ID'
                };
                res.status(404).json(response);
                return;
            }

            const response: ApiResponse<null> = {
                message: 'Category deleted successfully',
                success: true
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}
