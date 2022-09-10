# Scrantonicity

## About

Scrantonicity is an application for displaying metrics on the number of wifi devices within range of a Raspberry Pi 3+ (4 is not yet supported by the Re4son Kernel used here and the Zero W doesn't handle NodeJS very well). To gather those metrics, [Airodump-ng](https://www.aircrack-ng.org/doku.php?id=airodump-ng) is used and the results are piped to a SQLLite DB. From there, the DB is queried at a regular interval and when results are available the websocket server passes the data up to a web app for displaying the results (using [vis-timeline/vis-js](https://visjs.github.io/vis-timeline/docs/graph2d/))).

The idea behind this project was to have a self-contained unit for capturing and displaying wifi metrics. There were many other options for displaying the data but my goal was to build a fun project using Typescript (in addition to experimenting with wifi data). Building this whole thing in Python would be a better approach.

I needed some way of interacting with the web app and I didn't want to build a keyboard interface so this project leverages the GPIO pins on the Raspberry Pi and pushes command events to the app using web sockets.

The end goal was to have a self-contained unit with a Raspberry Pi and a screen. On bootup the device would need no interaction and would automatically start Chrome in fullscreen with the latest wifi device metrics visibible in a nice chart. I achieved most of that goal (except for automatically launching Chrome and running the app on start up).

## Result

Using a store-bought wooden box, I embedded a display ([Adafruit link](https://www.adafruit.com/product/2260)) and dropped the Pi inside the box. I had plans to have a servo raise and lower the lid but I've put that off for now.

### Front and side views:

<img src="https://user-images.githubusercontent.com/1512727/189503460-c51df3a1-d14e-41b8-8f8f-1971232c5ca1.jpg" align="left"  width=400 />


<img src="https://user-images.githubusercontent.com/1512727/189503462-d22d7aca-7241-4582-8d29-dd79f4f6b020.jpg" width=400 />

<br clear="left"/>



## TODOs

- splitting this into a repo for the web app and another (python-based) for the webscocket server and the airodump-ng wifi scraper
- pass the ip address in via command line argument (the current setup is terrible)
- setup on command to spin up the websocket server, airodump collecting, and a set of nighly cron jobs to calc daily & weekly average data
- nightly job to create averages of results
- weekly job for avererage
- monthly job to clone DB, delete orig except last 10 rows
- add logging to TS app

## Setup

Wifi setup
Prepare the device for wifi data scrapping and install Airodump-nq
https://medium.com/swlh/scanning-for-mobile-devices-through-wi-fi-using-pi-zero-w-8099be08cc1e

Install node: sudo apt-get install nodejs (15+), yarn
Install SQLLite: sudo apt-get install sqlite3 (might not need this since it's all handled in python)
Install pip3 if not already installed (lite version does not have it)
Install some python modules: websockets, sqlite, watchdog (for dev)
Clone this repo


## Startup script

- PM2 process starts for `yarn dev`
- terminal app opens and streams PM2 logs
- PM2 logs stop after n seconds or after touch screen input (not sure which)
- browser opens

sudo vim /etc/rc.local
/home/pi/.config/lxsession/LXDE-pi/autostart

pm2 start yarn --interpreter bash --name scrantonicty -- serve
https://stackoverflow.com/questions/45887206/using-pm2-to-do-yarn-start-gives-error-while-npm-start-works-fine/51902772#51902772e
https://app.pm2.io/bucket/61d1d8c53a7c85d32c7132cd/backend/overview/servers


power off USB-powered screen: https://github.com/mvp/uhubctl#raspberry-pi-4b
`$ uhubctl -l 2 -a 0`
