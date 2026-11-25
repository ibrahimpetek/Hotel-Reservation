

import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "hotel_reservation_flow";

function loadInitialState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    
  }
}

const ReservationContext = createContext(null);



export function ReservationProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  const updateFlow = (partial) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      persist(next);
      return next;
    });
  };

  const clearFlow = () => {
    setState({});
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ flow: state, updateFlow, clearFlow }), [state]);

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
}

export function useReservationFlow() {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error("useReservationFlow, ReservationProvider icinde kullanilmalidir");
  }
  return ctx;
}
