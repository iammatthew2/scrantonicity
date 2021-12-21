import time
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
        logging.error('file %s does not exist' % filename)
        return 0
    with open(filename,'r') as f:
        z = f.read()

        # Split into two parts: stations and clients
        parts = z.split('\n\n')
        
        if "Station" not in parts[1]:
            logging.error('file did not include headers')
            return 0
    
        # Remove header row and trailing linebreaks
        cleanedClientsList = parts[1].strip().split('\n', 1)[1]

        os.remove(filename)
        return len(cleanedClientsList.split('\n'))    
