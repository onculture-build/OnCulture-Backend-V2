import { faker } from '@faker-js/faker';

const sanityCourses = [
  {
    sanityId: '7e7c65ae-5daf-4187-8dac-ebe3ae7fc44d',
    createdAt: '2023-01-26T12:59:04Z',
    title: 'Preventing Sexual Harassment at Work',
    author: 'Adedoyin Tinuoluwa',
    modules: [
      {
        id: 'd40ac18d-bded-43c7-a772-f118e355d5df',
        moduleName: 'Module 1',
        moduleTitle: 'Preventing Sexual Harassment at Work',
        lessons: [
          {
            id: 'a7e89128-92f9-4d9c-a5a1-6174f6672ab4',
            lessonName: 'Introduction',
            lessonTitle: 'Welcome to the course',
          },
          {
            id: '27bdbb90-c7e8-416a-a493-85ad8866ce64',
            lessonName: 'Lesson 1',
            lessonTitle: 'What is Sexual Harassment at Work?',
          },
          {
            id: '86b99d65-3736-4e1b-ad78-62b2c5e752e2',
            lessonName: 'Lesson 2',
            lessonTitle: 'Types Of Sexual Harassment',
          },
          {
            id: '1898aced-b0f9-41a7-8b07-ecabfb192607',
            lessonName: 'Lesson 3',
            lessonTitle: 'Myths about Sexual Harassment',
          },
          {
            id: '94a2358c-8cc5-4a24-ad96-1b000825301c',
            lessonName: '1.1',
            lessonTitle: 'Module 1: Quiz 1',
          },
          {
            id: 'a8778bba-61c7-468a-8010-626e3b225e98',
            lessonName: 'Lesson 4',
            lessonTitle: 'Forms of Sexual Harassment at Work',
          },
          {
            id: '64cbf158-5d72-4eee-9222-314e9443634d',
            lessonName: 'Lesson 5',
            lessonTitle: 'Case Scenarios [Sexual Harassment]',
          },
          {
            id: 'a3c6ac74-81ea-48dd-b484-b8b47a802aed',
            lessonName: '1.2',
            lessonTitle: 'Module 1: Quiz 2',
          },
          {
            id: 'b5e5c5bc-6084-4937-aa2d-f514b6866b5a',
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
        id: 'e6170670-e11f-4ab8-89a6-867ef43ccc99',
        moduleName: 'Module 1',
        moduleTitle: 'Introduction to "Preventing Harassment at Work"',
        lessons: [
          {
            id: 'a8f133d0-4427-4812-be4f-f3059b5c171c',
            lessonName: 'Introduction',
            lessonTitle: 'Welcome to the Course',
          },
          {
            id: '7c51a053-14b6-4122-a8d6-6792d938a91a',
            lessonName: 'Lesson 1',
            lessonTitle: 'What Is and What is NOT Harassment at Work?',
          },
          {
            id: '58f6e993-f238-453a-ba2e-bac13baa3c92',
            lessonName: 'Lesson 2',
            lessonTitle: 'What Constitutes Harassment at Work?',
          },
          {
            id: 'c425400e-6ba3-4c12-8bba-826a490460a4',
            lessonName: 'Lesson 3',
            lessonTitle: 'Impact of Harassment at Work',
          },
          {
            id: 'c8b721f7-e799-4baf-9711-8bc09d6310cf',
            lessonName: '1.1',
            lessonTitle: 'Module 1, Quiz 1',
          },
        ],
      },
      {
        id: '5975fde8-f4a7-4fca-9027-8ae5691d8960',
        moduleName: 'Module 2',
        moduleTitle: 'Non-sexual Harassment at Work',
        lessons: [
          {
            id: '3b949c2d-8517-44f0-9016-d6f0617b7858',
            lessonName: '2.1',
            lessonTitle: 'Types of Non-sexual Harassment at Work',
          },
          {
            id: '69b02f56-f17e-46fb-be16-47f3897fd38e',
            lessonName: '2.2',
            lessonTitle: 'Types of Non-sexual Harassment; Discrimination',
          },
          {
            id: 'd101e6f6-4e66-44f8-b424-e538822e12e3',
            lessonName: '2.3',
            lessonTitle:
              "(Cont'd) Types of Non-sexual Harassment; Discrimination",
          },
          {
            id: 'fd5205d9-f568-40dd-94ff-2dd66c7a23b5',
            lessonName: '2.4',
            lessonTitle:
              'Types of Non-sexual Harassment; Personal, Verbal, Psychological & Physical',
          },
          {
            id: '545bfc9a-dab1-4775-bad2-00749e302b41',
            lessonName: '2.1',
            lessonTitle: 'Module 2, Quiz 1',
          },
          {
            id: '620e5c47-125e-41f2-bea5-e8e27c1ace75',
            lessonName: '2.5',
            lessonTitle:
              'Types of Non-sexual Harassment; Online, Retaliation, Power & Third-Party',
          },
          {
            id: '443ebd3b-0f67-44da-8e05-2fa232349ae7',
            lessonName: '2.2',
            lessonTitle: 'Module 2, Quiz 2',
          },
          {
            id: 'fc490b21-9b9e-4305-885d-e670b75d10ff',
            lessonName: '2.6',
            lessonTitle: 'Case Scenarios [Non-sexual harassment]',
          },
        ],
      },
      {
        id: 'd7cb43bd-33a5-4087-bc36-6de1ae0c687d',
        moduleName: 'Module 3',
        moduleTitle: 'Combating Harassment at Work',
        lessons: [
          {
            id: '22457d09-d5c2-4612-9a03-bdde1a171ad4',
            lessonName: '3.1',
            lessonTitle: 'Myths about Harassment',
          },
          {
            id: '2ea0e191-b28a-4d2a-bf03-316cc8aab1ff',
            lessonName: '3.2',
            lessonTitle: 'Combating Harassment at Work',
          },
          {
            id: 'ca753bee-57a7-460a-83e1-a45b38bcc30a',
            lessonName: '3.3',
            lessonTitle: 'Addressing Harassment at Work',
          },
          {
            id: '5dc647b3-93ae-4a9c-9185-d7c89a4ec64e',
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
