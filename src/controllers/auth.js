// src/controllers/auth.js
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { loginUser } from '../services/auth.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES } from '../constants/index.js';

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
      expires: new Date(Date.now() + FIFTEEN_MINUTES),
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

    const session = await SessionsCollection.findOne({ refreshToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const newAccessToken = 'newAccessToken';
    const newRefreshToken = 'newRefreshToken';

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
    session.refreshTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);

    await session.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + FIFTEEN_MINUTES),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + FIFTEEN_MINUTES),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
