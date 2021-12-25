#!/usr/bin/env python
import time
import json
from sql_utils import *
import asyncio
import websockets

async def socket_handler(websocket, test):
    database = r'__collect_wifi_data.db'
    filename = '__wifi-devices'
    finalFilename = filename + '-01.csv'
    wifiScanDuration = 60 # one minute

    # create a database connection
    conn = create_connection(database)
    print(f'handle websocket {websocket} ')
    while True:
        print(f'{get_last_row(conn)} is the last row' )
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
    async with websockets.serve(socket_handler, "192.168.1.54", 8039):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())