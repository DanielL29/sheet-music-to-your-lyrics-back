import { Router } from 'express';
import authorController from '../controllers/authorController';
import validateToken from '../middlewares/validateToken';

const authorRouter = Router();

authorRouter.get('/:category', validateToken, authorController.getByCategory);

export default authorRouter;
