#!/bin/bash

#Re-directs stderr to stdout, then stdout to /dev/null
starter="npm start 2>&1 > /dev/null &"
trap "killall -9 node" TERM

cd client/
eval $starter
cd ..
cd server/ 
eval $starter

echo "Started both client and server, CTRL+C / SIGINT to kill both"
tail -f /dev/null
