FROM node:lts-alpine AS base

WORKDIR /app
COPY ./node_modules /app/node_modules 
COPY ./package.json /app/package.json 
COPY ./dist /app/dist 
COPY ./.env ./


# 运行
CMD [ "node", "dist/main" ]
