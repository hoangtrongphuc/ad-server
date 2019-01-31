#!/usr/bin/env bash
docker run --rm -it --name creative-service -p 3001:3000 -v /Users/phucht/Projects/ad-server/creative-service/src:/opt/app --env-file .env creative-service
