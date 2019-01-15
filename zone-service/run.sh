#!/usr/bin/env bash

docker service create --replicas 1 --name zone-service -l=apiRoute='/zone' -p 3000:3000 --env-file .env -v /Users/phucht/Projects/ad-server/zone-service/src:/opt/app zone-dev
