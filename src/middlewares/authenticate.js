// src/middlewares/authenticate.js
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
//import { FIFTEEN_MINUTES } from '../constants/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    console.log('Authorization Header:', authHeader); // Логируем полученный заголовок

    if (!authHeader) {
      throw createHttpError(401, 'Please provide Authorization header');
    }

    const [bearer, token] = authHeader.split(' ');
    console.log('Bearer:', bearer, 'Token:', token); // Логируем разделенные части

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Auth header should be of type Bearer');
    }

    const session = await SessionsCollection.findOne({ accessToken: token });
    console.log('Session found:', session); // Логируем найденную сессию

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    console.log('Is Access Token Expired:', isAccessTokenExpired); // Логируем истек ли токен

    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = session.userId;
    console.log('User ID:', req.user); // Логируем userId

    next();
  } catch (err) {
    console.error('Authentication Error:', err); // Логируем ошибку
    next(err);
  }
};
