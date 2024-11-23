import { Contact } from '../db/models/contact.js'; // Модель контактов

// Получить все контакты
export const getContacts = async () => {
  const contacts = await Contact.find(); // Получаем все контакты
  return contacts;
};

// Получить контакт по ID
export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId); // Ищем контакт по ID
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });

  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
