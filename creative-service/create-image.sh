#!/usr/bin/env bash
docker rm -f creative-service

docker rmi creative-service

docker build -t creative-service .