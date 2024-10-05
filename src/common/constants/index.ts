export const allowedImageMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  'image/x-icon',
  'image/heif',
  'image/heic',
];

export const allowedCsvMimeTypes = ['text/csv', 'application/csv'];

export const PROFILE_UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const CSV_UPLOAD_MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const EMPLOYEE_MAPPINGS = {
  userInfo: {
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    gender: 'gender',
    dateOfBirth: 'dateOfBirth',
    maidenName: 'maidenName',
    formerNames: 'formerNames',
    prefix: 'prefix',
    suffix: 'suffix',
    maritalStatus: 'maritalStatus',
    countryCode: 'countryCode',
    religion: 'religion',
    preferredLanguage: 'preferredLanguage',
    linkedInURL: 'linkedInURL',
  },
  nextOfKin: {
    firstName: 'nextOfKinName',
    lastName: 'nextOfKinName',
    relationship: 'nextOfKinRelationship',
    phone: 'nextOfKinPhone',
    email: 'nextOfKinEmail',
  },
  employeeNo: 'employeeNo',
  departmentCode: 'departmentCode',
  jobRole: {
    title: 'jobRole',
  },
  employmentType: {
    title: 'employmentType',
  },
  bank: {
    bankName: 'bankName',
    accountName: 'accountName',
    accountNumber: 'accountNumber',
  },
};

export enum CREATE_EMPLOYEE_FIELDS {
  firstName = 'First Name',
  middleName = 'Middle Name',
  lastName = 'Last Name',
  email = 'Email',
  phone = 'Phone',
  gender = 'Gender',
  dateOfBirth = 'Date of Birth',
  maidenName = 'Maiden Name',
  formerNames = 'Former Names',
  prefix = 'Prefix',
  suffix = 'Suffix',
  maritalStatus = 'Marital Status',
  countryCode = 'Country',
  religion = 'Religion',
  preferredLanguage = 'Preferred Language',
  linkedInURL = 'LinkedIn URL',
  website = 'Website',
  employeeNo = 'Employee Number',
  departmentCode = 'Department',
  employmentType = 'Employment Type',
  jobRole = 'Job Role',
  nextOfKinName = 'Next of Kin Name',
  nextOfKinRelationship = 'Next of Kin Relationship',
  nextOfKinPhone = 'Next of Kin Phone',
  nextOfKinEmail = 'Next of Kin Email',
  bankName = 'Bank Name',
  accountName = 'Account Name',
  accountNumber = 'Account Number',
  swiftCode = 'SWIFT Code',
}
