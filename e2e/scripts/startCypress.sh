#!/bin/sh
set -x

ARGS="--browser chrome --headed"

if [ -n "$E2E_APP" ]; then
  npx cypress run $ARGS --spec "cypress/e2e/$E2E_APP/**"
else
  npx cypress run $ARGS
fi