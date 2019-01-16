#!/usr/bin/env bash

docker run --rm -it --name zone-service -l=apiRoute='/zone' -p 3002:3000 --env-file .env -v /Users/phucht/Projects/ad-server/zone-service/src:/opt/app zone-service
