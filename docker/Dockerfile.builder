ARG nodever=20
FROM node:${nodever}

RUN npm install -g pnpm

WORKDIR /data