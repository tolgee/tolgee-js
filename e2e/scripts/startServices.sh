#!/bin/sh
set -x

if [ -n "$E2E_APP" ]; then
  SERVICES="app `docker compose config --services | grep -E "^e2e_app_$E2E_APP(_dev|_prod)?$" | tr '\n' ' '`"
fi

docker compose up -d --build $SERVICES