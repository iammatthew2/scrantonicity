import logging
import os
import time
import time
from sql_utils import *
from wifi_scrape_utils import *


logging.basicConfig(filename='error.log', level=logging.DEBUG)

def main():
  database = r'__collect_wifi_data.db'
  filename = '__wifi-devices'
  finalFilename = filename + '-01.csv'
  wifiScanDuration = 5

  # create a database connection
  conn = create_connection(database)

  if os.path.exists(finalFilename):
      os.remove(finalFilename)

  while True:
    find_wifi_devices(wifiScanDuration, filename)
    if conn is not None:
      deviceCount = get_number_of_clients(finalFilename)
      add_device_count(conn, (deviceCount, time.time()))
    else:
      logging.error("could not connect to " + database)

if __name__ == '__main__':
    main()