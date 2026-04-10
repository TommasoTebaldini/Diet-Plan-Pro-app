import { createContext, useContext, useState, useCallback } from 'react';
import { hashPassword } from '../utils/crypto';

const AuthContext = createContext(null);

const ADMIN_USERNAME = 'tebaldinitommaso524@gmail.com';
const DEFAULT_PASSWORD = 'Juventus04.*';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('diet-auth-session')) || null;
    } catch {
      return null;
    }
  });

  const loginDietitian = useCallback(async (username, password) => {
    if (username !== ADMIN_USERNAME) return false;
    const stored = localStorage.getItem('diet-dietitian-password');
    const hashed = await hashPassword(password);
    if (!stored) {
      // First login: bootstrap with default password hash
      const defaultHash = await hashPassword(DEFAULT_PASSWORD);
      if (hashed !== defaultHash) return false;
    } else if (hashed !== stored) {
      return false;
    }
    const s = { role: 'dietitian', username: ADMIN_USERNAME };
    localStorage.setItem('diet-auth-session', JSON.stringify(s));
    setSession(s);
    return true;
  }, []);

  const loginPatient = useCallback(async (username, password) => {
    const accounts = JSON.parse(localStorage.getItem('diet-patient-accounts') || '[]');
    const hashed   = await hashPassword(password);
    const account  = accounts.find(a => a.username === username && a.passwordHash === hashed);
    if (account) {
      const s = { role: 'patient', username: account.username, patientId: account.id };
      localStorage.setItem('diet-auth-session', JSON.stringify(s));
      setSession(s);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('diet-auth-session');
    setSession(null);
  }, []);

  const changeDietitianPassword = useCallback(async (newPassword) => {
    const hashed = await hashPassword(newPassword);
    localStorage.setItem('diet-dietitian-password', hashed);
  }, []);

  return (
    <AuthContext.Provider value={{ session, loginDietitian, loginPatient, logout, changeDietitianPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
