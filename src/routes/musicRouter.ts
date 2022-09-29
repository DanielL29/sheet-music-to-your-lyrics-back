import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import musicController from '../controllers/musicController';
import validateSchemas from '../middlewares/validateSchemas';
import validateToken from '../middlewares/validateToken';

const musicRouter = Router();
const upload = multer(multerConfig);

musicRouter.post('/create', validateToken, upload.single('sheetMusicFile'), validateSchemas('music'), musicController.insert);

export default musicRouter;