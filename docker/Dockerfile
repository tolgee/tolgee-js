ARG nodever=20
FROM node:${nodever}-alpine

# gatsby needs to have access to user directory
RUN chmod -R 777 /root

WORKDIR /data

COPY wait-for-file /
