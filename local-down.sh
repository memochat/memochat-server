#!/bin/bash

docker-compose -f docker-compose.yml -f docker-compose.local.yml down

echo "Down Server Container"

docker-compose -f docker-compose.development-db.yml down

echo "Down Database Container"

docker network rm memochat-server-network

echo "Remove Network"
