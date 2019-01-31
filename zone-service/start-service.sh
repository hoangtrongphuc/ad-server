#!/usr/bin/env bash

docker run --rm -it --name zone-service -p 3003:3000 --env-file .env -v /Users/phucht/Projects/ad-server/zone-service/src:/opt/app zone-service
