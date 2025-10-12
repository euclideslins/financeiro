import { Request, Response } from "express";
import { CreateCategoryService } from "../services/Category/create-category.service";
import { GetAllUsersCategoryService } from "../services/Category/get-all-users-category.service";

export class CategoryController {
    // Implement category-related methods here

    private createCategoryService: CreateCategoryService;
    private getAllCategoriesService: GetAllUsersCategoryService;
    constructor() {
        this.createCategoryService = new CreateCategoryService();
        this.getAllCategoriesService = new GetAllUsersCategoryService();
    }


    createCategory = async (req: Request, res: Response) => {
        const { name, kind, parent_id, user_id } = req.body;

        try {
            const category = await this.createCategoryService.createCategory(name, kind, parent_id, user_id);
            res.status(201).json(category);
        } catch (error) {
            if (error instanceof Error && error.message === "User not found") {
                return res.status(404).json({
                    message: "Failed to create category",
                    success: false,
                    error: "User not found, try inserting an existing User",
                });
            }
            res.status(500).json({
                message: "Failed to create category",
                success: false,
                error: "Internal Server Error"
            });
        }
    }

    getAllCategoriesByUser = async (req: Request, res: Response) => {
        const user_id = Number(req.params.user_id);

        res.status(200).json(await this.getAllCategoriesService.getAllUsersCategory(user_id))

    }

    getCategoryById = async (req: Request, res: Response) => {
        // Logic for retrieving a category by ID
    }

    updateCategory = async (req: Request, res: Response) => {
        // Logic for updating a category
    }

    deleteCategory = async (req: Request, res: Response) => {
        // Logic for deleting a category
    }
}
