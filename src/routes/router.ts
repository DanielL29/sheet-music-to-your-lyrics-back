import { Router } from 'express';
import musicRouter from './musicRouter';
import userRouter from './userRouter';

const router = Router();

router.use('/users', userRouter);
router.use('/musics', musicRouter);

export default router;
