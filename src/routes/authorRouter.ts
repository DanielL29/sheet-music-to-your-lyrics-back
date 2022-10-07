import { Router } from 'express';
import authorController from '../controllers/authorController';
import validateToken from '../middlewares/validateToken';

const authorRouter = Router();

authorRouter.get('/:category', validateToken, authorController.getByCategory);
authorRouter.get('/', validateToken, authorController.getAll);

export default authorRouter;
