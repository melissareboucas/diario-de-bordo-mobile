import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define os tipos para o contexto
interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// Cria o contexto com os tipos
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define as propriedades do provider
interface UserProviderProps {
  children: ReactNode;
}

// Criação do Provider
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar o contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
