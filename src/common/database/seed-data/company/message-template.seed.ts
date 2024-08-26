import { MessageType } from '@prisma/client';

export const messageTemplateSeed = [
  {
    name: 'default',
    code: 'welcome',
    subject: 'Welcome to Onculture',
    type: MessageType.Email,
    isHtml: true,
    body: '',
  },
  {
    name: 'Employee account setup',
    code: 'employee-setup',
    subject: 'Employee Account Setup',
    type: MessageType.Email,
    isHtml: true,
    body: '',
  },
  {
    name: 'Employee Invite',
    code: 'invitation',
    subject: 'You have been invited to join Onculture',
    type: MessageType.Email,
    isHtml: true,
    body: '',
  },
];
