from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from typing import Dict, Any, Optional
import json
from pylabrobot.liquid_handling import LiquidHandler
from pylabrobot.resources import Resource, Deck
from pylabrobot.serializer import serialize

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
websocket_connections: set[WebSocket] = set()
# Store liquid handler instance
lh: Optional[LiquidHandler] = None
# Store current deck state
current_deck: Optional[Deck] = None

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.add(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            command = data.get("command")
            params = data.get("params", {})
            
            if command == "execute_step":
                await handle_step_execution(websocket, params)
            elif command == "initialize_deck":
                await initialize_deck(websocket, params)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        websocket_connections.remove(websocket)

async def broadcast_state_update(update_type: str, payload: Any):
    """Broadcast state update to all connected clients."""
    if not websocket_connections:
        return
        
    message = {
        "type": update_type,
        "payload": payload
    }
    
    for connection in websocket_connections:
        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Failed to send update to client: {e}")

async def handle_step_execution(websocket: WebSocket, step_data: Dict[str, Any]):
    """Handle execution of a protocol step."""
    global lh, current_deck
    
    if not lh or not current_deck:
        await websocket.send_json({
            "type": "error",
            "payload": "Liquid handler not initialized"
        })
        return
        
    try:
        # Execute the step based on its type
        step_type = step_data["type"]
        
        if step_type == "transfer":
            source = step_data["source"]
            destination = step_data["destination"]
            volume = step_data["volume"]
            
            # Execute transfer operation
            await lh.pick_up_tips()
            await lh.aspirate(source["labwareId"], source["wellId"], volume)
            await lh.dispense(destination["labwareId"], destination["wellId"], volume)
            await lh.drop_tips()
            
        elif step_type == "mix":
            labware_id = step_data["labwareId"]
            well_id = step_data["wellId"]
            volume = step_data["volume"]
            
            # Execute mix operation
            await lh.pick_up_tips()
            await lh.mix(labware_id, well_id, volume)
            await lh.drop_tips()
            
        # Broadcast updated state
        serialized_deck = serialize(current_deck)
        await broadcast_state_update("resource_update", serialized_deck)
        await broadcast_state_update("step_complete", step_data)
        
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "payload": str(e)
        })

async def initialize_deck(websocket: WebSocket, deck_data: Dict[str, Any]):
    """Initialize the deck with the provided configuration."""
    global lh, current_deck
    
    try:
        # Create deck from configuration
        deck = Deck.from_dict(deck_data)
        current_deck = deck
        
        # Initialize liquid handler with deck
        lh = LiquidHandler()
        await lh.setup()
        await lh.connect()
        await lh.load_deck(deck)
        
        # Send confirmation
        serialized_deck = serialize(deck)
        await broadcast_state_update("resource_update", serialized_deck)
        
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "payload": str(e)
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
