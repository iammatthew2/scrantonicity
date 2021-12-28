
#!/usr/bin/env python
import sys
import json
from sql_utils import *
import asyncio
import websockets

time_between_db_queries = 45

def create_socket_package(db_response_list, view_state = 'static'):
    socket_data_package = {
        'viewState': view_state,
        'graphDataPoints': []
    }

    for row in db_response_list:
        socket_data_package['graphDataPoints'].append({ 'x': float(row[2]), 'y': row[1] })

    return socket_data_package

async def socket_handler(websocket, test):
    database = r'__collect_wifi_data.db'

    conn = create_connection(database)
    most_recent_entries = get_last_rows(conn, 100)

    # handle the initial payload then wait for more data to be collected
    if most_recent_entries:
        initial_data_package = create_socket_package(most_recent_entries)
        last_sent_id = most_recent_entries[0][0]
        await websocket.send(json.dumps(initial_data_package))

    await asyncio.sleep(time_between_db_queries)
    while True:
        latest_rows = get_rows_greater_than(conn, last_sent_id)
        if latest_rows:
            socket_payload = create_socket_package(latest_rows)
            last_sent_id = latest_rows[0][0]
            try:
                await websocket.send(json.dumps(socket_payload))
            except websockets.exceptions.ConnectionClosed:
                print(f'connection closed for {websocket}')
                break
            except:
                print(f'Unexpected error: {sys.exc_info()[0]}')
                break

        await asyncio.sleep(time_between_db_queries)


async def main():
    print("starting up...")
    async with websockets.serve(socket_handler, "192.168.1.54", 8039):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())