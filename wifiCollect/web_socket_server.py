
#!/usr/bin/env python
import sys
import json
from sql_utils import *
import asyncio
import websockets

connected = set()
primary_instance = False

async def socket_handler(websocket, test):
    connected.add(websocket)
    database = r'__collect_wifi_data.db'

    conn = create_connection(database)
    most_recent_entries = get_last_rows(conn, 10)
    initial_data_package = {
        'viewState': 'static',
    }
    initial_data_package['graphDataPoints'] = []
    

    for row in most_recent_entries:
        initial_data_package['graphDataPoints'].append({ 'x': float(row[2]), 'y': row[1] })
    
    last_sent_id = most_recent_entries[0][0]
    print(f'newest entry in the bulk batch: {last_sent_id}')
    await websocket.send(json.dumps(initial_data_package))

    await asyncio.sleep(20)
    while True:
        last_row = get_last_rows(conn, 1)[0]
        print(f'{last_row} is the last row' )
        print(f'last_row[0]: {last_row[0]} {type(last_row[0])}')
        print(f'id: {last_sent_id} {type(last_sent_id)}')
        if last_sent_id < last_row[0]:
            last_sent_id = last_row[0]
            socket_payload = {
                'viewState': 'static',
                'graphDataPoints': [
                    { 'x': float(last_row[2]), 'y': last_row[1] },
                ]
            }

            print(f'length: {len(connected)}')
            try:
                await websocket.send(json.dumps(socket_payload))
            except websockets.exceptions.ConnectionClosed:
                print(f'connection closed for {websocket}')
                connected.remove(websocket)
                break
            except:
                print(f'Unexpected error: {sys.exc_info()[0]}')
                break

        await asyncio.sleep(5)


async def main():
    print("starting up...")
    async with websockets.serve(socket_handler, "192.168.1.54", 8039):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())