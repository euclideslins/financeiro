import { Router } from "express";
import { AccountsController } from "../controllers/accounts-controller";
import { AuthenticationTokenMiddleware } from "../middleware/Authentication/authentication-token.middleware";


const accountRouter = Router();
const accountController = new AccountsController();
const authenticationTokenMiddleware = new AuthenticationTokenMiddleware();


accountRouter.post('/create/:userId', accountController.createAccountForUser)
accountRouter.get('/', authenticationTokenMiddleware.use, accountController.getAllAccounts)
accountRouter.get('/:id', accountController.getAccountById)
accountRouter.put('/:id', accountController.updateAccount)

export default accountRouter;