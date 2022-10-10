import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import musicSnippetController from '../controllers/musicSnippetController';
import validateSchemas from '../middlewares/validateSchemas';
import validateTeacher from '../middlewares/validateTeacher';
import validateToken from '../middlewares/validateToken';

const musicSnippetRouter = Router();

const upload = multer(multerConfig);

musicSnippetRouter.post(
  '/:musicName/create',
  validateToken,
  validateTeacher,
  upload.single('snippetAid'),
  validateSchemas('musicSnippet'),
  musicSnippetController.insert,
);

musicSnippetRouter.get('/:musicName/snippets', validateToken, musicSnippetController.getMusicSnippets);

musicSnippetRouter.patch(
  '/:musicSnippetId/update',
  validateToken,
  validateTeacher,
  upload.single('snippetAid'),
  validateSchemas('musicSnippetUpdate'),
  musicSnippetController.update,
);

export default musicSnippetRouter;
