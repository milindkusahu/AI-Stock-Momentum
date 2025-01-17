import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import { StockController } from './controllers/stockController';
import { rateLimiter } from './middleware/rateLimiter';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
const stockController = new StockController();

// Routes
app.get('/api/stock/:symbol', rateLimiter.middleware.bind(rateLimiter), stockController.analyzeStock);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});