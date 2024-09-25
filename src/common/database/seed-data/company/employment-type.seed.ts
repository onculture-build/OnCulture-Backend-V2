import { faker } from '@faker-js/faker';

const employmentType = [
  {
    title: 'Fulltime',
    description:
      'Permanent employment with regular working hours and benefits.',
  },
  {
    title: 'Contract',
    description:
      'Temporary employment for a specific period or project, often without long-term benefits',
  },
  {
    title: 'Internship',
    description:
      'Short-term training position for students or recent graduates, often with limited pay or benefits.',
  },
];

faker.seed(11224);

export const employmentTypeSeed = employmentType.map((type) => ({
  ...type,
  id: faker.string.uuid(),
}));
