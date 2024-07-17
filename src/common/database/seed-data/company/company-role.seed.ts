import { faker } from '@faker-js/faker';
import { RoleType } from '.prisma/company';

const roles = [
  {
    name: 'Account Owner',
    description:
      'This role owns the subscription account. It is the default role assigned to the email account used to sign up to OctoCare. \n\nAccount Owner has full access to the application by default.',
    code: 'owner',
    type: RoleType.System,
    // menuPermissions: [],
    // schemaPermissions: [],
  },
  {
    name: 'Administrator',
    description:
      'This is the role assigned to anyone with full access to the Admin module which grants the rights to administer the system.',
    code: 'admin',
    type: RoleType.System,
    // menuPermissions: [],
    // schemaPermissions: [],
  },
];

faker.seed(11224);

export const roleSeed = roles.map((role) => ({
  ...role,
  id: faker.string.uuid(),
}));
