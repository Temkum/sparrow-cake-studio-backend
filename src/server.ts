import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import cakeRoutes from './routes/cake.routes';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/cakes', cakeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
