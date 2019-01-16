#!/usr/bin/env bash

docker run --rm -it --name ad-selector-service -l=apiRoute='/ad-selector' -p 3003:3000 --env-file .env -v /Users/phucht/Projects/ad-server/ad-selector-service/src:/opt/app ad-selector-service
