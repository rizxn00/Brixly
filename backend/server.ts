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
    origin: [CORS_ORIGIN, 'https://your-frontend-domain.vercel.app'], // Add your frontend Vercel URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(cookieParser());

// Improved MongoDB connection for serverless environment
const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log('Already connected to MongoDB');
      return;
    }
    
    await mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
    });
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't throw error, let the app start but log the issue
  }
};

// Connect to database
connectDB();

// Add database health check endpoint
app.get('/db-test', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      database: {
        state: states[dbState as keyof typeof states],
        connected: dbState === 1,
        url: process.env.MONGODB_URL ? 'Present' : 'Missing'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add root route for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running on Vercel!', 
    status: 'healthy',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    }
  });
});

app.use('/health', health);
app.use('/api/auth', auth);
app.use('/api/brands', brands);
app.use('/api/products', products);

// For local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Listening on: ${PORT}`));
}

// Export for Vercel
export default app;
