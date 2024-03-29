import axios from 'axios';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext<{
  token: string | null;
  setToken: (newToken: string | null) => void;
  userInfo: JwtPayload | null;
} | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [userInfo, setUserInfo] = useState<JwtPayload | null>(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      localStorage.setItem('token', token);
      const userInfoData = jwtDecode(token);
      setUserInfo(userInfoData);
      localStorage.setItem('userInfo', JSON.stringify(userInfoData));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setUserInfo(null);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      userInfo,
    }),
    [token, userInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
