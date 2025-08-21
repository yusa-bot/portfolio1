import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface RequestData {
  url: string;
  method: string;
  status: number;
  timings: Record<string, number>;
  region: string;
  cache: string;
  totalTime: number;
  serverTime?: number;
  error?: string;
  timestamp: number;
}

export interface HUDState {
  visible: boolean;
  timings: Map<string, number>;
  region: string;
  cache: string;
  totalTime: number;
  requests: RequestData[];
}

type HUDAction =
  | { type: 'TOGGLE_HUD' }
  | { type: 'ADD_TIMING'; payload: Omit<RequestData, 'timestamp'> }
  | { type: 'SET_REGION'; payload: string }
  | { type: 'SET_CACHE'; payload: string };

const initialState: HUDState = {
  visible: false,
  timings: new Map(),
  region: 'unknown',
  cache: 'unknown',
  totalTime: 0,
  requests: []
};

function hudReducer(state: HUDState, action: HUDAction): HUDState {
  switch (action.type) {
    case 'TOGGLE_HUD':
      return { ...state, visible: !state.visible };

    case 'ADD_TIMING':
      const newRequest: RequestData = {
        ...action.payload,
        timestamp: Date.now()
      };

      const updatedRequests = [...state.requests, newRequest].slice(-20); // 最新20件のみ保持
      const totalTime = updatedRequests.reduce((sum, req) => sum + (req.totalTime || 0), 0);

      return {
        ...state,
        requests: updatedRequests,
        totalTime
      };

    case 'SET_REGION':
      return { ...state, region: action.payload };

    case 'SET_CACHE':
      return { ...state, cache: action.payload };

    default:
      return state;
  }
}

interface HUDContextType {
  state: HUDState;
  dispatch: React.Dispatch<HUDAction>;
}

const HUDContext = createContext<HUDContextType | undefined>(undefined);

export function HUDProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(hudReducer, initialState);

  return (
    <HUDContext.Provider value={{ state, dispatch }}>
      {children}
    </HUDContext.Provider>
  );
}

export function useHUD() {
  const context = useContext(HUDContext);
  if (context === undefined) {
    throw new Error('useHUD must be used within a HUDProvider');
  }
  return context;
}

export function useHUDState() {
  return useHUD().state;
}

export function useHUDDispatch() {
  return useHUD().dispatch;
}
