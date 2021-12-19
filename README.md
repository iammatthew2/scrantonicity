# Scrantonicity

## About

Scrantonicity is an application for displaying metrics on the number of wifi devices within range of a Raspberry Pi 3+ (4 is not yet supported by the Re4son Kernel used here and the Zero W doesn't handle NodeJS very well). To gather those metrics, [Airodump-ng](https://www.aircrack-ng.org/doku.php?id=airodump-ng) is used and the results are piped to a SQLLite DB. From there, the DB is queried at a regular interval and when results are available the websocket server passes the data up to a web app for displaying the results (using vis-timeline)).

The idea behind this project was to have a self-contained unit for capturing and displaying wifi metrics. There were many other options for displaying the data but my goal was to build a fun project using Typescript (in addition to experimenting with wifi data). Building this whole thing in Python would be a better approach.

I needed some way of interacting with the web app and I didn't want to build a keyboard interface so this project leverages the GPIO pins on the Raspberry Pi and pushes command events to the app using web sockets

## Setup

Wifi setup
Prepare the device for wifi data scrapping and install Airodump-nq
https://medium.com/swlh/scanning-for-mobile-devices-through-wi-fi-using-pi-zero-w-8099be08cc1e

Install node: sudo apt-get install nodejs
Install SQLLite: sudo apt-get install sqlite3
Clone this repo
