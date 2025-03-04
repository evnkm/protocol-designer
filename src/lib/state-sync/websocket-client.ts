import { DeckStateManager } from "../state-manager/DeckStateManager";

export type StateUpdate = {
  type: "resource_update" | "step_complete" | "error";
  payload: any;
};

export class VisualizerWebSocket {
  private ws!: WebSocket;
  private stateManager: DeckStateManager;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(stateManager: DeckStateManager) {
    this.stateManager = stateManager;
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket("ws://localhost:8000/ws");
      this.setupListeners();
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error("Failed to connect to PyLabRobot backend:", error);
      this.handleReconnect();
    }
  }

  private setupListeners() {
    this.ws.onmessage = (event) => {
      try {
        const update: StateUpdate = JSON.parse(event.data);
        this.stateManager.handleStateUpdate(update);
      } catch (error) {
        console.error("Failed to parse websocket message:", error);
      }
    };

    this.ws.onclose = () => {
      console.warn("WebSocket connection closed");
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(
        () => this.connect(),
        1000 * Math.pow(2, this.reconnectAttempts)
      );
    }
  }

  public async sendCommand(command: string, params: any): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket connection is not open");
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws.send(JSON.stringify({ command, params }));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
