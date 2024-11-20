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
