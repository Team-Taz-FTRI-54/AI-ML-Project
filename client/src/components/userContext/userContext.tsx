import { createContext } from 'react';

type UserContextType = {
  username: string;
  setUsername: (username: string) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
