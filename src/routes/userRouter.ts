import { Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/sign-up', userController.insert);

export default userRouter;
