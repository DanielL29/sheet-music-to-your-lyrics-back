import { Router } from 'express';
import categoryRouter from './categoryRouter';
import musicRouter from './musicRouter';
import musicSnippetRouter from './musicSnippetRouter';
import userRouter from './userRouter';

const router = Router();

router.use('/users', userRouter);
router.use('/musics', musicRouter);
router.use('/musicSnippets', musicSnippetRouter);
router.use('/categories', categoryRouter);

export default router;
