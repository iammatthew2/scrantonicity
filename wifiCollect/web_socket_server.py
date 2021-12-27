#!/usr/bin/env python
import time
import json
from sql_utils import *
import asyncio
import websockets

async def socket_handler(websocket, test):
    database = r'__collect_wifi_data.db'
    filename = '__wifi-devices'
    last_sent_id = 1
    finalFilename = filename + '-01.csv'
    wifiScanDuration = 60 # one minute

    # create a database connection
    conn = create_connection(database)
    print(f'handle websocket {websocket} ')
    while True:
        last_row = get_last_row(conn)
        print(f'{last_row} is the last row' )
        print(f'{last_row}')
        if last_sent_id < last_row[0]:
            last_sent_id = last_row[0]
            socket_payload = {
                'viewState': 'static',
                'graphDataPoints': [
                    { 'x': float(last_row[2]), 'y': last_row[1] },
                ]
            }

            await websocket.send(json.dumps(socket_payload))
        print("sleeping ")
        time.sleep(20)

async def main():
    print("starting up...")
    async with websockets.serve(socket_handler, "192.168.1.54", 8039):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())