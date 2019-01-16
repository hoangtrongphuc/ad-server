#!/usr/bin/env bash
docker rm -f ad-selector-service

docker rmi ad-selector-service

docker build -t ad-selector-service .