import React, { createContext, useContext, useEffect, useState } from 'react';
import { DeckStateManager } from '../state-manager/DeckStateManager';
import { DeckResource } from '@/components/deck-visualization/types';

interface VisualizerContextType {
  stateManager: DeckStateManager;
  currentState: DeckResource;
  updateState: (state: DeckResource) => void;
  stateHistory: DeckResource[];
}

const defaultState: DeckResource = {
  id: 'default-deck',
  name: 'Default Deck',
  type: 'HamiltonSTARDeck',
  position: { x: 0, y: 0 },
  dimensions: { width: 100, depth: 100 },
  children: []
};

const VisualizerContext = createContext<VisualizerContextType | null>(null);

export function VisualizerProvider({ 
  children, 
  initialState = defaultState
}: { 
  children: React.ReactNode; 
  initialState?: DeckResource;
}) {
  const [stateManager] = useState(() => new DeckStateManager(initialState));
  const [currentState, setCurrentState] = useState(initialState);
  const [stateHistory, setStateHistory] = useState([initialState]);

  const updateState = (state: DeckResource) => {
    setCurrentState(state);
    stateManager.updateState(state);
  };

  useEffect(() => {
    const unsubscribe = stateManager.subscribe((state) => {
      setCurrentState(state);
      setStateHistory(stateManager.getStateHistory());
    });

    return () => {
      unsubscribe();
      stateManager.cleanup();
    };
  }, [stateManager]);

  return (
    <VisualizerContext.Provider 
      value={{ 
        stateManager, 
        currentState, 
        updateState,
        stateHistory 
      }}
    >
      {children}
    </VisualizerContext.Provider>
  );
}

export function useVisualizerState() {
  const context = useContext(VisualizerContext);
  if (!context) {
    throw new Error('useVisualizerState must be used within a VisualizerProvider');
  }
  return context;
}
