import { Router } from 'express';
import authorRouter from './authorRouter';
import categoryRouter from './categoryRouter';
import musicRouter from './musicRouter';
import musicSnippetRouter from './musicSnippetRouter';
import userRouter from './userRouter';

const router = Router();

router.use('/users', userRouter);
router.use('/musics', musicRouter);
router.use('/musicSnippets', musicSnippetRouter);
router.use('/categories', categoryRouter);
router.use('/authors', authorRouter);

export default router;
