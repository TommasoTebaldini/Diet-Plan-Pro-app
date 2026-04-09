import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('diet-auth-session')) || null;
    } catch {
      return null;
    }
  });

  const loginDietitian = useCallback((password) => {
    const stored = localStorage.getItem('diet-dietitian-password') || 'admin123';
    if (password === stored) {
      const s = { role: 'dietitian', username: 'dietitian' };
      localStorage.setItem('diet-auth-session', JSON.stringify(s));
      setSession(s);
      return true;
    }
    return false;
  }, []);

  const loginPatient = useCallback((username, password) => {
    const accounts = JSON.parse(localStorage.getItem('diet-patient-accounts') || '[]');
    const account = accounts.find(a => a.username === username && a.password === password);
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

  const changeDietitianPassword = useCallback((newPassword) => {
    localStorage.setItem('diet-dietitian-password', newPassword);
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
