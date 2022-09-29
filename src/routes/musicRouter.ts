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
  '/update/:musicId',
  validateToken,
  upload.single('sheetMusicFile'),
  validateSchemas('musicUpdate'),
  validateEmptyMusicUpdate,
  musicController.update,
);

export default musicRouter;
