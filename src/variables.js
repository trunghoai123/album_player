import { v4 as uuidv4 } from 'uuid';

export const initialFonts = [
  {
    id: 1,
    name: 'Adobe Caslon Pro',
  },

  {
    id: 2,
    name: 'Adobe Garamond Pro',
  },
  {
    id: 3,
    name: 'Another Danger',
  },
  {
    id: 4,
    name: 'ArnoPro',
  },
  {
    id: 5,
    name: 'Baby Coffee',
  },
  {
    id: 6,
    name: 'Bell Gothic Std',
  },
  {
    id: 7,
    name: 'Bickham Script Pro',
  },
  {
    id: 8,
    name: 'Blackoak Std',
  },
  {
    id: 9,
    name: 'Brush Script Std',
  },
  {
    id: 10,
    name: 'Candire',
  },
  {
    id: 11,
    name: 'Chaparral Pro',
  },
  {
    id: 12,
    name: 'Charlemagne Std',
  },
  {
    id: 13,
    name: 'Christmas Bell',
  },
  {
    id: 14,
    name: 'CollectionFree',
  },
  {
    id: 15,
    name: 'Cooper Std',
  },
  {
    id: 16,
    name: 'Crayone',
  },
  {
    id: 17,
    name: 'Crimes Times Six',
  },
  {
    id: 18,
    name: 'DK Jambo',
  },
  {
    id: 19,
    name: 'Eccentric Std',
  },
  {
    id: 20,
    name: 'Fleepavlop',
  },
  {
    id: 21,
    name: 'Adobe Garamond Pro',
  },
  {
    id: 22,
    name: 'Giddyup Std',
  },
  {
    id: 23,
    name: 'Hiatus',
  },
  {
    id: 24,
    name: 'Hobo Std',
  },
  {
    id: 25,
    name: 'Letter Gothic Std',
  },
  {
    id: 26,
    name: 'Lithos Pro',
  },
  {
    id: 27,
    name: 'Marthin Slant',
  },
  {
    id: 28,
    name: 'Mesquite Std',
  },
  {
    id: 29,
    name: 'Mesquite Std',
  },
  {
    id: 30,
    name: 'Nueva Std Bold Condensed',
  },
  {
    id: 31,
    name: 'Nueva Std Condensed',
  },
  {
    id: 32,
    name: 'Rosewood Std',
  },
  {
    id: 33,
    name: 'Star Guard Mid-Case',
  },
  {
    id: 34,
    name: 'Stencil Std',
  },
  {
    id: 35,
    name: 'Supernova',
  },
  {
    id: 36,
    name: 'Tekton Pro',
  },
  {
    id: 37,
    name: 'Trajan Pro',
  },
];
export const initialValue = [
  {
    id: uuidv4(),
    text: 'Type Your Text Here',
    size: 16,
    font: {
      ...initialFonts[0],
    },
    style: 'normal',
    x: 0,
    y: 0,
  },
];
