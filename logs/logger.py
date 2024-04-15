from os import system
from time import sleep

while True:
    system("clear")
    system("tail -n 20 websocket.log")
    sleep(5)
