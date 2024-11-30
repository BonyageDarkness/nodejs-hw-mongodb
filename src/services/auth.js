import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js'; // Импорт константы

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // Используем FIFTEEN_MINUTES
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY), // Используем ONE_DAY
  });

  return session;
};
export const refreshUserSession = async (refreshToken) => {
  // Найти сессию по refreshToken
  const session = await SessionsCollection.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Генерация новых токенов
  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  // Обновление токенов и их времени действия
  session.accessToken = newAccessToken;
  session.refreshToken = newRefreshToken;
  session.accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES); // 15 минут
  session.refreshTokenValidUntil = new Date(Date.now() + ONE_DAY); // 1 день

  await session.save(); // Сохранение обновленных данных

  return session; // Возвращаем обновлённую сессию
};
