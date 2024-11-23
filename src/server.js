import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

export const startServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler); // Обработчик маршрутов, которые не найдены

  app.use(errorHandler); // Глобальный обработчик ошибок

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
