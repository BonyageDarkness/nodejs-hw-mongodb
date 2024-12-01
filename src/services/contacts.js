import { Contact } from '../db/models/contact.js';
import createHttpError from 'http-errors';

// Получить все контакты с пагинацией
export const getContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  try {
    const contacts = await Contact.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    const totalItems = await Contact.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  } catch (error) {
    console.error('Error in getContacts:', error);
    throw error;
  }
};

// Получить контакт по ID
export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId }); // Ищем контакт по ID
  return contact;
};

export const createContact = async (payload) => {
  try {
    const contact = await Contact.create(payload);
    return contact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const updateContact = async (contactId, userId, payload) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId }, // Проверяем, что контакт принадлежит пользователю
    payload,
    { new: true },
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found or not owned by the user');
  }

  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found or not owned by the user');
  }

  return contact;
};
