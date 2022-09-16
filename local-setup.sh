#!/bin/bash

docker network create memochat-server-network

echo "External Network Setup"

docker-compose -f docker-compose.development-db.yml up -d

echo "Development Database Container Running"

docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d