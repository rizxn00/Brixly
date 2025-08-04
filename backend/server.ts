import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import health from './routers/health';
import auth from './routers/auth';
import brands from './routers/brands';
import products from './routers/product';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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

// Enhanced MongoDB connection for serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const options = {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(MONGODB_URL, options);
    isConnected = true;
    console.log('Connected To MongoDB...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('Mongoose disconnected');
});

// Middleware to ensure database connection for each request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({ error: 'Database connection failed' });
  }
});

app.use('/health', health);
app.use('/api/auth', auth);
app.use('/api/brands', brands);
app.use('/api/products', products);

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Listening on: ${PORT}`));
}

// For Vercel, export the app
export default app;