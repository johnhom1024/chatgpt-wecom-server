FROM node:lts-alpine AS base

WORKDIR /app
COPY /app/node_modules ./node_modules
COPY /app/package.json ./package.json
COPY /app/dist ./dist
COPY ./.env ./


# 运行
CMD [ "node", "dist/main" ]
