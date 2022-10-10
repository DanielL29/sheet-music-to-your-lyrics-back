import { Router } from 'express';
import userController from '../controllers/userController';
import validateSchemas from '../middlewares/validateSchemas';
import validateToken from '../middlewares/validateToken';

const userRouter = Router();

userRouter.post('/sign-up', validateSchemas('signUp'), userController.insert);
userRouter.post('/sign-in', validateSchemas('signIn'), userController.login);
userRouter.post('/make-contributor/:email', userController.makeContributor);
userRouter.post('/send-email-contributor', validateToken, userController.sendEmailToContributor);

export default userRouter;
