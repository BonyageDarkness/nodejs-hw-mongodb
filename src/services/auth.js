import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES } from '../constants/index.js'; // Импорт константы

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken: 'dummyAccessToken',
    refreshToken: 'dummyRefreshToken',
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // Используем FIFTEEN_MINUTES
    refreshTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // Используем FIFTEEN_MINUTES
  });

  return session;
};
