import cookieParser from 'cookie-parser';
import express from 'express'; 
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) }}));

import logger from '#configs/logger.js';


app.get('/', (req, res) => {
  logger.info('Hello from Aquisitions Service');
  
  res.status(200).send('Hello from Aquisitions Service');
});

export default app;
