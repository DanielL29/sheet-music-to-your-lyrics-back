import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import validateToken from '../middlewares/validateToken';

const categoryRouter = Router();

categoryRouter.get('/', validateToken, categoryController.getAll);

export default categoryRouter;
