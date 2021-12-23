#!/usr/bin/env python
import time
import json

import asyncio
import websockets

async def hello(websocket, test):
    while True:
        socket_payload = {
            'viewState': 'continuous',
            'graphDataPoints': [
                { 'x': time.time() * 1000 + 1000, 'y': 1 },
                { 'x': time.time() * 1000 + 2000, 'y': 2 },
                { 'x': time.time() * 1000 - 6000, 'y': 3 },
                { 'x': time.time() * 1000 - 8000, 'y': 5 },
                { 'x': time.time() * 1000, 'y': 0 }
            ]
        }

        await websocket.send(json.dumps(socket_payload))
        print("sleeping ")
        time.sleep(5)

async def main():
    print("starting up...")
    async with websockets.serve(hello, "192.168.1.54", 8039):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())