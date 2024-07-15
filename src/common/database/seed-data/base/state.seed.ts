import { faker } from '@faker-js/faker';

const states = [
  {
    iso2: 'NG-AB',
    name: 'Abia',
  },
  {
    iso2: 'NG-FC',
    name: 'Abuja Federal Capital Territory',
  },
  {
    iso2: 'NG-AD',
    name: 'Adamawa',
  },
  {
    iso2: 'NG-AK',
    name: 'Akwa Ibom',
  },
  {
    iso2: 'NG-AN',
    name: 'Anambra',
  },
  {
    iso2: 'NG-BA',
    name: 'Bauchi',
  },
  {
    iso2: 'NG-BY',
    name: 'Bayelsa',
  },
  {
    iso2: 'NG-BE',
    name: 'Benue',
  },
  {
    iso2: 'NG-BO',
    name: 'Borno',
  },
  {
    iso2: 'NG-CR',
    name: 'Cross River',
  },
  {
    iso2: 'NG-DE',
    name: 'Delta',
  },
  {
    iso2: 'NG-EB',
    name: 'Ebonyi',
  },
  {
    iso2: 'NG-ED',
    name: 'Edo',
  },
  {
    iso2: 'NG-EK',
    name: 'Ekiti',
  },
  {
    iso2: 'NG-EN',
    name: 'Enugu',
  },
  {
    iso2: 'NG-GO',
    name: 'Gombe',
  },
  {
    iso2: 'NG-IM',
    name: 'Imo',
  },
  {
    iso2: 'NG-JI',
    name: 'Jigawa',
  },
  {
    iso2: 'NG-KD',
    name: 'Kaduna',
  },
  {
    iso2: 'NG-KN',
    name: 'Kano',
  },
  {
    iso2: 'NG-KT',
    name: 'Katsina',
  },
  {
    iso2: 'NG-KE',
    name: 'Kebbi',
  },
  {
    iso2: 'NG-KO',
    name: 'Kogi',
  },
  {
    iso2: 'NG-KW',
    name: 'Kwara',
  },
  {
    iso2: 'NG-LA',
    name: 'Lagos',
  },
  {
    iso2: 'NG-NA',
    name: 'Nasarawa',
  },
  {
    iso2: 'NG-NI',
    name: 'Niger',
  },
  {
    iso2: 'NG-OG',
    name: 'Ogun',
  },
  {
    iso2: 'NG-ON',
    name: 'Ondo',
  },
  {
    iso2: 'NG-OS',
    name: 'Osun',
  },
  {
    iso2: 'NG-OY',
    name: 'Oyo',
  },
  {
    iso2: 'NG-PL',
    name: 'Plateau',
  },
  {
    iso2: 'NG-RI',
    name: 'Rivers',
  },
  {
    iso2: 'NG-SO',
    name: 'Sokoto',
  },
  {
    iso2: 'NG-TA',
    name: 'Taraba',
  },
  {
    iso2: 'NG-YO',
    name: 'Yobe',
  },
  {
    iso2: 'NG-ZA',
    name: 'Zamfara',
  },
];

faker.seed(21111111);

export const stateSeed = states.map((state) => ({
  ...state,
  id: faker.string.uuid(),
}));
