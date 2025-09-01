import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthenticationTokenMiddleware } from '../middleware/Authentication/authentication-token.middleware';
import { validateCreateUser, validateUpdateUser } from '../middleware/validation';

const userRouter = Router();
const userController = new UserController();
const authenticationTokenMiddleware = new AuthenticationTokenMiddleware();



userRouter.get('/', authenticationTokenMiddleware.use, userController.getAllUsers);

userRouter.get('/:id', authenticationTokenMiddleware.use, userController.getUserById);

userRouter.post('/', validateCreateUser, authenticationTokenMiddleware.use, userController.createUser);

userRouter.post('/login', userController.loginUser);

userRouter.put('/:id', validateUpdateUser, authenticationTokenMiddleware.use, userController.updateUser);

userRouter.delete('/:id', authenticationTokenMiddleware.use, userController.deleteUser);

export default userRouter;