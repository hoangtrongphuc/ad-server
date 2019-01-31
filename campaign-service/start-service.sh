#!/usr/bin/env bash
docker run --rm -it --name campaign-service -p 3002:3000 -v /Users/phucht/Projects/ad-server/campaign-service/src:/opt/app --env-file .env campaign-service
