import express from 'express';
import { config } from './config';
import errorMiddleware from './middleware/error.middleware';
import loggerMiddleware from './middleware/logger.middleware';
import { indexRouteGetHandler } from './routes/index.routes';
import { createLogger } from './utils/logger';

const app = express();
export const logger = createLogger();

// middleware (has to be registered before routes)
app.use(loggerMiddleware);

// app routes
app.get('/', indexRouteGetHandler);

app.listen(config.app.port, () => console.log(`Running on http://localhost:${config.app.port}`));

// error middleware must be registered at the end
app.use(errorMiddleware);
