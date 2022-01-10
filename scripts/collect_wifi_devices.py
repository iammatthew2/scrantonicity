#!/usr/bin/env python
import logging
import os
import time
import time
from utils.sql_utils import *
from utils.wifi_scrape_utils import *


logging.basicConfig(filename='collect_wifi_devices_error.log', level=logging.DEBUG)

def main():
  database = '__collect_wifi_data.db'
  filename = '__wifi-devices'
  finalFilename = filename + '-01.csv'
  wifiScanDuration = 10 # one minute

  # create a database connection
  conn = create_connection(database)

  if os.path.exists(finalFilename):
      os.remove(finalFilename)

  while True:
    find_wifi_devices(wifiScanDuration, filename)
    if conn is not None:
      deviceCount = get_number_of_clients(finalFilename)
      print(f'device count: {deviceCount}')
      add_device_count(conn, (deviceCount, time.time() * 1000))
    else:
      logging.error("could not connect to " + database)

if __name__ == '__main__':
    main()