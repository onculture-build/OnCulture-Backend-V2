import { MessageType } from '@prisma/client';

export const baseMessageTemplateSeed = [
  {
    name: 'Welcome',
    code: 'welcome',
    subject: 'Welcome to Onculture!',
    type: MessageType.Email,
    isHtml: true,
    body: '',
  },
  {
    name: 'Welcome Request',
    code: 'welcome-request',
    subject: 'Thank you for signing up to Onculture!',
    type: MessageType.Email,
    isHtml: true,
    body: '',
  },
];
