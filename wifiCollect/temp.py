# run bash process
# parse results
# push into db with current timestamp
# repeatx

#import subprocess
#airodump = subprocess.Popen(['sudo','airodump-ng','mon0'])
#out,err = airodump.communicate(timeout=10)


import subprocess

import psutil


def kill(proc_pid):
    process = psutil.Process(proc_pid)
    for proc in process.children(recursive=True):
        proc.kill()
    process.kill()


proc = subprocess.Popen(['sudo airodump-ng -w myOutput --output-format csv mon0'], shell=True)
#proc = subprocess.Popen(['sudo', 'airodump-ng', 'mon0'])
try:
    proc.wait(timeout=3)
except subprocess.TimeoutExpired:
    kill(proc.pid)


# data model:

# timestamp, count, [ids]

# id, timestamp added, timestamp recent