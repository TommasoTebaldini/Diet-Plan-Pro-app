import { useCallback } from 'react';

export function usePatientStorage(patientId, key, defaultValue) {
  const storageKey = `diet-patient-${patientId}-${key}`;

  const getValue = useCallback(() => {
    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, [storageKey, defaultValue]);

  const setValue = useCallback((value) => {
    try {
      const toStore = typeof value === 'function' ? value(getValue()) : value;
      localStorage.setItem(storageKey, JSON.stringify(toStore));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [storageKey, getValue]);

  return [getValue, setValue];
}
