import { Router } from "express";
import { TransactionsController } from "../controllers/transactions-controller";
import { AuthenticationTokenMiddleware } from "../middleware/Authentication/authentication-token.middleware";


const transactionsRouter = Router();
const authenticationTokenMiddleware = new AuthenticationTokenMiddleware();
const transactionsController = new TransactionsController();

transactionsRouter.get('/user/:user_id', authenticationTokenMiddleware.use, transactionsController.getTransactionById);



export default transactionsRouter;
