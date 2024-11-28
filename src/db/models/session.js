import { model, Schema } from 'mongoose';
import { FIFTEEN_MINUTES } from '../../constants/index.js';

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenValidUntil: {
    type: Date,
    required: true,
    default: Date.now() + FIFTEEN_MINUTES,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
    default: Date.now() + FIFTEEN_MINUTES,
  },
});

export const SessionsCollection = model('Session', sessionSchema);
