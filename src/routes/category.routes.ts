import { Router } from "express";
import { CategoryController } from "../controllers/category-controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post('/', categoryController.createCategory);
categoryRouter.get('/:user_id', categoryController.getAllCategoriesByUser);

export default categoryRouter;