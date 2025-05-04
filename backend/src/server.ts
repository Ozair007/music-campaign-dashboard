import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { campaignsRouter } from './routes/campaigns';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://music-campaign-dashboard.netlify.app']
}));
app.use(bodyParser.json());

// Routes
app.use('/api/campaigns', campaignsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
export const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;