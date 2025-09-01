import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { serverConfig } from './config/database';
import { testConnection } from './database/connection';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import userRouter from './routes/user.routes';

const app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/users', userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const startServer = async () => {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(serverConfig.port, () => {
      console.log(`🚀 Server running on http://localhost:${serverConfig.port}`);
      console.log(`📊 Environment: ${serverConfig.env}`);
      console.log(`📡 Health check: http://localhost:${serverConfig.port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();