import { atom } from 'jotai';

export interface User {
  id: string;
  userName: string;
  userLastName: string;
  userNickname: string;
  email: string;
  phone: string;
  birthday: string;
  favoriteAnimes: string;
  favoriteMangas: string;
  userHobbies: string;
  userInfo: string;
  userProfilePictures: string;
}

export const userAtom = atom<User | null>(null);
