import { VisualizerWebSocket, StateUpdate } from '../state-sync/websocket-client';
import { DeckResource } from '@/components/deck-visualization/types';
import { ProtocolStep } from '@/types/protocol';

export class DeckStateManager {
  private websocket: VisualizerWebSocket;
  private currentState: DeckResource;
  private stateHistory: DeckResource[] = [];
  private listeners: Set<(state: DeckResource) => void> = new Set();

  constructor(initialState: DeckResource) {
    this.currentState = initialState;
    this.stateHistory = [initialState];
    this.websocket = new VisualizerWebSocket(this);
  }

  public handleStateUpdate(update: StateUpdate) {
    switch (update.type) {
      case 'resource_update':
        this.updateResource(update.payload);
        break;
      case 'step_complete':
        this.stateHistory.push(this.currentState);
        this.notifyListeners();
        break;
      case 'error':
        console.error('Error from PyLabRobot backend:', update.payload);
        break;
    }
  }

  public updateState(newState: DeckResource) {
    this.currentState = newState;
    this.notifyListeners();
  }

  private updateResource(resourceUpdate: Partial<DeckResource>) {
    // Deep merge the resource update with current state
    this.currentState = this.mergeStates(this.currentState, resourceUpdate);
    this.notifyListeners();
  }

  private mergeStates(current: DeckResource, update: Partial<DeckResource>): DeckResource {
    if (!current) return update as DeckResource;
    
    return {
      ...current,
      ...update,
      children: update.children 
        ? update.children.map(child => {
            const currentChild = current.children?.find(c => c.id === child.id);
            return currentChild 
              ? this.mergeStates(currentChild, child)
              : child as DeckResource;
          })
        : current.children || []
    };
  }

  public async executeStep(step: ProtocolStep): Promise<void> {
    try {
      await this.websocket.sendCommand('execute_step', step);
    } catch (error) {
      console.error('Failed to execute step:', error);
      throw error;
    }
  }

  public getCurrentState(): DeckResource {
    return this.currentState;
  }

  public getStateHistory(): DeckResource[] {
    return [...this.stateHistory];
  }

  public subscribe(listener: (state: DeckResource) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  public cleanup() {
    this.websocket.disconnect();
    this.listeners.clear();
  }
}
