import { Router } from 'express';
import musicContributorController from '../controllers/musicContributorController';
import validateToken from '../middlewares/validateToken';

const musicContributorRouter = Router();

musicContributorRouter.get('/:musicName/contributors', validateToken, musicContributorController.contributorsByMusic);

export default musicContributorRouter;
