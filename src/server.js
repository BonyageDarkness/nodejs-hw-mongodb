import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

import { getContacts, getContactById } from './services/contacts.js';

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
  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();

    res.status(200).json({
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    // Відповідь, якщо контакт не знайдено
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
};
