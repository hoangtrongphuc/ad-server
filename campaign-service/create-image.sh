#!/usr/bin/env bash
docker rm -f campaign-service

docker rmi campaign-service

docker build -t campaign-service .