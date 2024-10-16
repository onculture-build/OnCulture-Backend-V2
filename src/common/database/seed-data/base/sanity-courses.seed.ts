import { faker } from '@faker-js/faker';

const sanityCourses = [
  {
    sanityId: '7e7c65ae-5daf-4187-8dac-ebe3ae7fc44d',
    createdAt: '2023-01-26T12:59:04Z',
    title: 'Preventing Sexual Harassment at Work',
    author: 'Adedoyin Tinuoluwa',
    modules: [
      {
        moduleName: 'Module 1',
        moduleTitle: 'Preventing Sexual Harassment at Work',
        lessons: [
          {
            lessonName: 'Introduction',
            lessonTitle: 'Welcome to the course',
          },
          {
            lessonName: 'Lesson 1',
            lessonTitle: 'What is Sexual Harassment at Work?',
          },
          {
            lessonName: 'Lesson 2',
            lessonTitle: 'Types Of Sexual Harassment',
          },
          {
            lessonName: 'Lesson 3',
            lessonTitle: 'Myths about Sexual Harassment',
          },
          {
            lessonName: '1.1',
            lessonTitle: 'Module 1: Quiz 1',
          },
          {
            lessonName: 'Lesson 4',
            lessonTitle: 'Forms of Sexual Harassment at Work',
          },
          {
            lessonName: 'Lesson 5',
            lessonTitle: 'Case Scenarios [Sexual Harassment]',
          },
          {
            lessonName: '1.2',
            lessonTitle: 'Module 1: Quiz 2',
          },
          {
            lessonName: 'Lesson 6',
            lessonTitle: 'Combating & Addressing Harassment at Work',
          },
        ],
      },
    ],
  },
  {
    sanityId: 'fc8e1aa5-bcb0-476e-821e-647eb28240b8',
    createdAt: '2023-12-15T15:59:38Z',
    title: 'Preventing Non-Sexual Harassment at Work',
    author: 'Adedoyin Tinuoluwa',
    modules: [
      {
        moduleName: 'Module 1',
        moduleTitle: 'Introduction to "Preventing Harassment at Work"',
        lessons: [
          {
            lessonName: 'Introduction',
            lessonTitle: 'Welcome to the Course',
          },
          {
            lessonName: 'Lesson 1',
            lessonTitle: 'What Is and What is NOT Harassment at Work?',
          },
          {
            lessonName: 'Lesson 2',
            lessonTitle: 'What Constitutes Harassment at Work?',
          },
          {
            lessonName: 'Lesson 3',
            lessonTitle: 'Impact of Harassment at Work',
          },
          {
            lessonName: '1.1',
            lessonTitle: 'Module 1, Quiz 1',
          },
        ],
      },
      {
        moduleName: 'Module 2',
        moduleTitle: 'Non-sexual Harassment at Work',
        lessons: [
          {
            lessonName: '2.1',
            lessonTitle: 'Types of Non-sexual Harassment at Work',
          },
          {
            lessonName: '2.2',
            lessonTitle: 'Types of Non-sexual Harassment; Discrimination',
          },
          {
            lessonName: '2.3',
            lessonTitle:
              "(Cont'd) Types of Non-sexual Harassment; Discrimination",
          },
          {
            lessonName: '2.4',
            lessonTitle:
              'Types of Non-sexual Harassment; Personal, Verbal, Psychological & Physical',
          },
          {
            lessonName: '2.1',
            lessonTitle: 'Module 2, Quiz 1',
          },
          {
            lessonName: '2.5',
            lessonTitle:
              'Types of Non-sexual Harassment; Online, Retaliation, Power & Third-Party',
          },
          {
            lessonName: '2.2',
            lessonTitle: 'Module 2, Quiz 2',
          },
          {
            lessonName: '2.6',
            lessonTitle: 'Case Scenarios [Non-sexual harassment]',
          },
        ],
      },
      {
        moduleName: 'Module 3',
        moduleTitle: 'Combating Harassment at Work',
        lessons: [
          {
            lessonName: '3.1',
            lessonTitle: 'Myths about Harassment',
          },
          {
            lessonName: '3.2',
            lessonTitle: 'Combating Harassment at Work',
          },
          {
            lessonName: '3.3',
            lessonTitle: 'Addressing Harassment at Work',
          },
          {
            lessonName: '3.1',
            lessonTitle: 'Module 3, Quiz 1',
          },
        ],
      },
    ],
  },
];

faker.seed(1111111);

export const sanityCoursesSeed = sanityCourses.map((course) => ({
  ...course,
  id: faker.string.uuid(),
}));
