// src/models/contact.js
import { model, Schema } from 'mongoose';
import {
  CONTACT_TYPE_PERSONAL,
  CONTACT_TYPES,
} from '../../constants/contacts.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // Необязательно
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      required: false, // Необязательно
      default: false, // Значение по умолчанию
    },
    contactType: {
      type: String,
      required: true,
      enum: CONTACT_TYPES,
      default: CONTACT_TYPE_PERSONAL,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Contact = model('Contact', contactSchema);
