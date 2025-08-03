import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import health from './routers/health';
import auth from './routers/auth';
import brands from './routers/brands';
import products from './routers/product';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '8000', 10);
const CORS_ORIGIN: string = process.env.CORS_ORIGIN || 'http://localhost:5173';
const MONGODB_URL: string = process.env.MONGODB_URL || '';

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: [CORS_ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(MONGODB_URL || '')
  .then(() => console.log('Connected To MongoDB...'))
  .catch((err) => console.log(err));

app.use('/health', health);
app.use('/api/auth', auth);
app.use('/api/brands', brands)
app.use('/api/products', products);


app.listen(PORT, () => console.log(`Listening on: ${PORT}`));