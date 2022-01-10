#!/usr/bin/env python
import sys
import json
from utils.sql_utils import *
import asyncio
import websockets
import logging


logging.basicConfig(filename='socket_server_error.log', level=logging.DEBUG)
time_between_db_queries = 30
last_sent_id = 0

async def websocket_send_db_result(websocket, db_result, groupName = 'chicken'):
    global last_sent_id
    if db_result:
        socket_package = create_socket_package(db_result, groupName)
        last_sent_id = db_result[0][0]
        try:
            await websocket.send(json.dumps(socket_package))
        except websockets.exceptions.ConnectionClosed:
            print(f'connection closed for {websocket}')
        except:
            print(f'Unexpected error: {sys.exc_info()[0]}')
            logging.error(f'Unexpected error: {sys.exc.info()[0]}')

def create_socket_package(db_response_list, groupName, view_state = 'static'):
    socket_data_package = {
        'viewState': view_state,
        'graphDataPoints': []
    }

    for row in db_response_list:
        socket_data_package['graphDataPoints'].append({ 'x': float(row[2]), 'y': row[1], 'group': 'Live' })
        socket_data_package['graphDataPoints'].append({ 'x': float(row[2]), 'y': row[3], 'group': 'Average' })

    return socket_data_package

async def socket_handler(websocket, test):
    global last_sent_id
    database = r'/home/pi/dev/scrantonicity/scripts/__collect_wifi_data.db'

    conn = create_connection(database)
    most_recent_entries = get_last_rows(conn, 1000, True)

    # handle the initial payload then wait for more data to be collected
    print('sending initial data to new socket')
    await websocket_send_db_result(websocket, most_recent_entries, 'narf')
    await asyncio.sleep(time_between_db_queries)

    while websocket.state == 1:
        latest_rows = get_rows_greater_than(conn, last_sent_id, True)
        await websocket_send_db_result(websocket, latest_rows)
        await asyncio.sleep(time_between_db_queries)

async def main():
    print("starting up...")
    logging.error("starting up log")
    async with websockets.serve(socket_handler, "192.168.1.54", 8039):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())