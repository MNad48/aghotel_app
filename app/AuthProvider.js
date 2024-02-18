// AuthContext.js
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authId, setAuthId] = useState(null);
  const setAuthIdAndNavigate = (id) => {
    setAuthId(id);
    // You can add navigation logic here if needed
  };

  return (
    <AuthContext.Provider value={{ authId, setAuthId: setAuthIdAndNavigate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
