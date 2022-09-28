import { Router } from 'express';
import userController from '../controllers/userController';
import validateSchemas from '../middlewares/validateSchemas';

const userRouter = Router();

userRouter.post('/sign-up', validateSchemas('signUp'), userController.insert);

export default userRouter;