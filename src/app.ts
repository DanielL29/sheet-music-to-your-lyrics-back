import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import router from './routes/router';
import errorsHandler from './errors/errorsHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);
app.use(errorsHandler);

export default app;
