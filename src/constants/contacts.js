export const CONTACTS_PER_PAGE = 10;
export const CONTACT_TYPE_HOME = 'home';
export const CONTACT_TYPE_PERSONAL = 'personal';
export const CONTACT_TYPE_WORK = 'work';
export const CONTACT_TYPES = [
  CONTACT_TYPE_PERSONAL,
  CONTACT_TYPE_WORK,
  CONTACT_TYPE_HOME,
];
export const CONTACT_FIELDS_LIST = [
  '_id',
  'name',
  'email',
  'phoneNumber',
  'contactType',
  'createdAt',
  'updatedAt',
];

export const CONTACT_DEFAULT_SORT_FIELD = CONTACT_FIELDS_LIST[0];
