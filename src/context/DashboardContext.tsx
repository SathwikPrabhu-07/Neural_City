import React, { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { DashboardState, DashboardAction } from '../types';
import { computeMetrics } from '../data/computeMetrics';
import { MATCHED_CITIES } from '../data/cities';
import { FULL_NCRB } from '../data/ncrb';

const initialState: DashboardState = {
  cities: computeMetrics(MATCHED_CITIES),
  fullNcrb: FULL_NCRB,
  selectedCityId: null,
  mapFilter: 'all',
  sortField: 'sri',
  sortAscending: false,
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SELECT_CITY':
      return { ...state, selectedCityId: action.cityId };
    case 'SET_FILTER':
      return { ...state, mapFilter: action.filter };
    case 'SET_SORT':
      return { ...state, sortField: action.field, sortAscending: action.ascending };
    default:
      return state;
  }
};

const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
