import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Journey = {
  destination: string;
  year: string;
  timestamp: number;
  mission?: string;
  souvenir?: string;
  badge?: string;
  paradoxLevel?: number;
};

export type TravelState = {
  passport: Journey[];
  souvenirs: string[];
  badges: string[];
  memory: Record<string, any>; // simple key/value store for AI memory
};

type TravelContextProps = {
  state: TravelState;
  addJourney: (journey: Journey) => void;
  addSouvenir: (item: string) => void;
  addBadge: (badge: string) => void;
  updateMemory: (key: string, value: any) => void;
};

const TravelContext = createContext<TravelContextProps | undefined>(undefined);

export const TravelProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TravelState>(() => {
    // Load from localStorage if present
    const stored = localStorage.getItem('travelState');
    return stored ? JSON.parse(stored) : { passport: [], souvenirs: [], badges: [], memory: {} };
  });

  // Persist on change
  useEffect(() => {
    localStorage.setItem('travelState', JSON.stringify(state));
  }, [state]);

  const addJourney = (journey: Journey) => {
    setState(prev => ({
      ...prev,
      passport: [...prev.passport, journey]
    }));
  };

  const addSouvenir = (item: string) => {
    setState(prev => ({
      ...prev,
      souvenirs: [...prev.souvenirs, item]
    }));
  };

  const addBadge = (badge: string) => {
    setState(prev => ({
      ...prev,
      badges: [...prev.badges, badge]
    }));
  };

  const updateMemory = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      memory: { ...prev.memory, [key]: value }
    }));
  };

  return (
    <TravelContext.Provider value={{ state, addJourney, addSouvenir, addBadge, updateMemory }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
