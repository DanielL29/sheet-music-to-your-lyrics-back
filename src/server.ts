import dotenv from 'dotenv';
import app from './app';
import 'dotenv/config';

dotenv.config();
const { PORT } = process.env;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}...`));
