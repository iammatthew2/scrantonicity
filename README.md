# Scrantonicity

## About

Scrantonicity is an application for displaying metrics on the number of wifi devices within range of a Raspberry Pi 3+ (4 is not yet supported by the Re4son Kernel used here and the Zero W doesn't handle NodeJS very well). To gather those metrics, [Airodump-ng](https://www.aircrack-ng.org/doku.php?id=airodump-ng) is used and the results are piped to a SQLLite DB. From there, the DB is queried at a regular interval and when results are available the websocket server passes the data up to a web app for displaying the results (using vis-timeline)).

The idea behind this project was to have a self-contained unit for capturing and displaying wifi metrics. There were many other options for displaying the data but my goal was to build a fun project using Typescript (in addition to experimenting with wifi data). Building this whole thing in Python would be a better approach.

I needed some way of interacting with the web app and I didn't want to build a keyboard interface so this project leverages the GPIO pins on the Raspberry Pi and pushes command events to the app using web sockets

## TODOs

- splitting this into a repo for the web app and another (python-based) for the webscocket server and the airodump-ng wifi scraper
- pass the ip address in via command line argument
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
