import time
from datetime import datetime
import subprocess
import os
import logging


def find_wifi_devices(duration, filename):
    p = subprocess.Popen(["airodump-ng","-w", filename,"--output-format","csv", "mon0"])
    time.sleep(duration)
    p.terminate()
    time.sleep(5)


def get_number_of_clients(filename):
    if not os.path.exists(filename):
        logging.error(f'{datetime.now().isoformat()} - file does not exist: {filename}')
        return 0
    with open(filename,'r') as f:
        z = f.read()

        # delete the file before we hit any of the returns
        os.remove(filename)

        # Split into two parts: stations and clients
        parts = z.split('\n\n')
        
        if "Station" not in parts[1]:
            logging.error(f'{datetime.now().isoformat()} - headers not found {filename}')
            return 0
    
        # Remove trailing linebreaks and subtract rows to account for header row and this device
        clientListLength = len(parts[1].strip().split('\n')) - 2

        if clientListLength < 0:
            logging.warn(f'{datetime.now().isoformat()} - empty client list: {parts}')
            return 0

        return clientListLength 
