#!/bin/bash
source ./venv/bin/activate
docker compose down --volumes
cd src
pnpm update
cd ..
docker compose build