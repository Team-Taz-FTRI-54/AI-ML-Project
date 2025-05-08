import { useState } from 'react';
import type { ReactNode } from 'react';
import { UserContext } from './userContext';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsernameState] = useState(() => localStorage.getItem('username') || '');

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem('username', newUsername);
  };

  return <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>;
};
