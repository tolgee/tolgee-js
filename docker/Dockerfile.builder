ARG nodever=16
FROM node:${nodever}

RUN npm install -g pnpm

WORKDIR /data