#!/usr/bin/env bash
docker run --rm -it --name ad-selector-service -p 3004:3000 -v /Users/phucht/Projects/ad-server/ad-selector-service/src:/opt/app --env-file .env ad-selector-service
