FROM node:lts-alpine AS base

RUN npm install pnpm -g --registry=https://registry.npm.taobao.org

FROM base AS dependencies

WORKDIR /app
COPY ./package.json /app
COPY ./pnpm-lock.yaml /app
COPY ./tsconfig.json /app
COPY ./.env /app
COPY ./tsconfig.build.json /app
RUN pnpm install --registry=https://registry.npm.taobao.org

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM base AS deploy

WORKDIR /app
COPY --from=dependencies /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY ./.env ./
COPY --from=build /app/node_modules ./node_modules


# 运行
CMD [ "node", "dist/main" ]
