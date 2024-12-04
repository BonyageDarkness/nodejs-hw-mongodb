// src/controllers/auth.js
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { loginUser } from '../services/auth.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { refreshUserSession } from '../services/auth.js';

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UsersCollection.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashedPassword };
    const newUser = await UsersCollection.create(userData);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + FIFTEEN_MINUTES),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    await SessionsCollection.deleteOne({ refreshToken });

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    const session = await refreshUserSession(refreshToken);

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(session.refreshTokenValidUntil), // Используем дату из сессии
    });

    // Установка sessionId в куки
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(session.accessTokenValidUntil), // Используем дату из сессии
    });

    // Возвращаем новый accessToken
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Проверяем, существует ли пользователь
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Генерация JWT-токена с email
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    const resetPasswordUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Формирование письма
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>To reset your password, click the link below:</p>
             <a href="${resetPasswordUrl}" target="_blank">Reset Password</a>
             <p>This link is valid for 5 minutes.</p>`,
    };

    // Отправка письма
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    console.error('Error in sendResetEmailController:', err);

    if (err.message.includes('Failed to send')) {
      next(
        createHttpError(
          500,
          'Failed to send the email, please try again later.',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    await SessionsCollection.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
