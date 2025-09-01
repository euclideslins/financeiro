import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateCreateUser, validateUpdateUser } from '../middleware/validation';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:id', userController.getUserById);

userRouter.post('/', validateCreateUser, userController.createUser);

userRouter.post('/login', userController.loginUser);

userRouter.put('/:id', validateUpdateUser, userController.updateUser);

userRouter.delete('/:id', userController.deleteUser);

export default userRouter;