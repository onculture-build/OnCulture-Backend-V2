export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DEACTIVATED = 'Deactivated',
}

export enum EmailProviders {
  SendGrid = 'SendGrid',
  Smtp = 'Smtp',
}

export enum BrowserEvents {
  DOM_CONTENT_LOADED = 'domcontentloaded',
  LOADED = 'load',
  NETWORK_IDLE = 'networkidle0',
}

export enum MediaTypes {
  SCREEN = 'screen',
  PRINT = 'print',
}

export enum RelationshipType {
  FATHER = 'Father',
  MOTHER = 'Mother',
  HUSBAND = 'Husband',
  WIFE = 'Wife',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  BROTHER = 'Brother',
  SISTER = 'Sister',
  NEPHEW = 'Nephew',
  NEICE = 'Niece',
}

export enum CompanyRequestStatus {
  Approved = 'Approved',
  Onboarded = 'Onboarded',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export enum CompanyRequestAction {
  ResendActivationEmail = 'ResendActivationEmail',
}
