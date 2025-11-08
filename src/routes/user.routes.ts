import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthenticationTokenMiddleware } from '../middleware/Authentication/authentication-token.middleware';
import { apiLimiter, authLimiter, registerLimiter, writeLimiter } from '../middleware/rate-limiter';
import { validateCreateUser, validateUpdateUser } from '../middleware/validation';

const userRouter = Router();
const userController = new UserController();
const authenticationTokenMiddleware = new AuthenticationTokenMiddleware();


userRouter.get('/', apiLimiter, authenticationTokenMiddleware.use, userController.getAllUsers);

userRouter.get('/:id', apiLimiter, authenticationTokenMiddleware.use, userController.getUserById);

userRouter.post('/register', registerLimiter, validateCreateUser, userController.createUser);

userRouter.post('/', authenticationTokenMiddleware.use, writeLimiter, validateCreateUser, userController.createUser);

userRouter.post('/login', authLimiter, userController.loginUser);

userRouter.put('/:id', authenticationTokenMiddleware.use, writeLimiter, validateUpdateUser, userController.updateUser);
userRouter.delete('/:id', authenticationTokenMiddleware.use, writeLimiter, userController.deleteUser);

export default userRouter;