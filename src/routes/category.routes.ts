import { Router } from "express";
import { CategoryController } from "../controllers/category-controller";
import { AuthenticationTokenMiddleware } from "../middleware/Authentication/authentication-token.middleware";
import { apiLimiter, writeLimiter } from "../middleware/rate-limiter";
import { validateCreateCategory, validateUpdateCategory } from "../middleware/validation";

const categoryRouter = Router();
const categoryController = new CategoryController();
const authenticationTokenMiddleware = new AuthenticationTokenMiddleware();

categoryRouter.get('/user/:user_id', apiLimiter, authenticationTokenMiddleware.use, categoryController.getAllCategoriesByUser);

categoryRouter.get('/:id', apiLimiter, authenticationTokenMiddleware.use, categoryController.getCategoryById);

categoryRouter.post('/', authenticationTokenMiddleware.use, writeLimiter, validateCreateCategory, categoryController.createCategory);

categoryRouter.put('/:id', authenticationTokenMiddleware.use, writeLimiter, validateUpdateCategory, categoryController.updateCategory);

categoryRouter.delete('/:id', authenticationTokenMiddleware.use, writeLimiter, categoryController.deleteCategory);

export default categoryRouter;