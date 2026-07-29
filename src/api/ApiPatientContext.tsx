import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PatientDetail, PatientListItem } from './types';

interface ApiPatientState {
  patientId: string | null;
  listItem: PatientListItem | null;
  detail: PatientDetail | null;
  selectPatient: (item: PatientListItem) => void;
  setDetail: (detail: PatientDetail | null) => void;
  clearPatient: () => void;
}

const ApiPatientContext = createContext<ApiPatientState | null>(null);

export const ApiPatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [listItem, setListItem] = useState<PatientListItem | null>(null);
  const [detail, setDetailState] = useState<PatientDetail | null>(null);

  const selectPatient = useCallback((item: PatientListItem) => {
    setPatientId(item.patient_id);
    setListItem(item);
    setDetailState(null);
  }, []);

  const setDetail = useCallback((d: PatientDetail | null) => {
    setDetailState(d);
    if (d) {
      setPatientId(d.patient_id);
    }
  }, []);

  const clearPatient = useCallback(() => {
    setPatientId(null);
    setListItem(null);
    setDetailState(null);
  }, []);

  const value = useMemo(
    () => ({ patientId, listItem, detail, selectPatient, setDetail, clearPatient }),
    [patientId, listItem, detail, selectPatient, setDetail, clearPatient],
  );

  return <ApiPatientContext.Provider value={value}>{children}</ApiPatientContext.Provider>;
};

export function useApiPatient(): ApiPatientState {
  const ctx = useContext(ApiPatientContext);
  if (!ctx) {
    throw new Error('useApiPatient must be used within ApiPatientProvider');
  }
  return ctx;
}
