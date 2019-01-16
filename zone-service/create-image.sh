#!/usr/bin/env bash
docker rm -f zone-service

docker rmi zone-service

docker build -t zone-service .