// src/controllers/contacts.js
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getContactsController = async (req, res, next) => {
  try {
    console.log('Started getContactsController');
    console.log('User:', req.user); // Логируем данные пользователя

    if (!req.user) {
      return res
        .status(401)
        .json({ status: 401, message: 'User not authenticated' });
    }

    const userId = req.user._id;
    console.log('userId:', userId);

    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'asc';

    const filter = { userId };
    if (req.query.isFavourite !== undefined) {
      filter.isFavourite = req.query.isFavourite === 'true';
    }
    if (req.query.contactType) {
      filter.contactType = req.query.contactType;
    }

    console.log('Filter:', filter);

    const result = await getContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });
    console.log('Found contacts:', result);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: result.contacts,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (err) {
    console.error('Error in getContactsController:', err);
    next(err);
  }
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact || !contact.userId.equals(req.user._id)) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, contactType, email, isFavourite } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber, contactType',
      );
    }

    const userId = req.user?._id;
    if (!userId) {
      throw createHttpError(401, 'User not authenticated');
    }

    const contact = await createContact({
      name,
      phoneNumber,
      contactType,
      email,
      isFavourite,
      userId,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    if (Object.keys(req.body).length === 0) {
      throw createHttpError(400, 'No data provided for update');
    }

    const updatedContact = await updateContact(contactId, userId, req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    await deleteContact(contactId, userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
