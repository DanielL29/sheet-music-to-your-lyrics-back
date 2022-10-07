import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import musicController from '../controllers/musicController';
import validateEmptyMusicUpdate from '../middlewares/validateEmptyMusicUpdate';
import validateSchemas from '../middlewares/validateSchemas';
import validateToken from '../middlewares/validateToken';

const musicRouter = Router();
const upload = multer(multerConfig);

musicRouter.post(
  '/create',
  validateToken,
  upload.single('sheetMusicFile'),
  validateSchemas('music'),
  musicController.insert,
);

musicRouter.patch(
  '/update/:musicName',
  validateToken,
  upload.single('sheetMusicFile'),
  validateEmptyMusicUpdate,
  validateSchemas('musicUpdate'),
  musicController.update,
);

musicRouter.get('/find/:musicName', validateToken, musicController.getByName);

musicRouter.get('/category/:categoryName', validateToken, musicController.getByCategory);

musicRouter.get('/author/:authorName', validateToken, musicController.getByAuthor);

export default musicRouter;
