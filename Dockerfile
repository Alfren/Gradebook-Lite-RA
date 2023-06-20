ARG BASE_REGISTRY=registry1.dso.mil
ARG BASE_IMAGE=ironbank/opensource/nodejs/nodejs18
ARG BASE_TAG=18.16.0-slim

FROM ${BASE_REGISTRY}/${BASE_IMAGE}:${BASE_TAG} AS build

WORKDIR /app

ENV APP_HOME=/app

COPY public ${APP_HOME}/public
COPY src ${APP_HOME}/src
COPY nginx ${APP_HOME}/nginx
COPY package.json ${APP_HOME}/package.json

USER root

RUN yarn install
RUN yarn build

# Stage 2 - NGINX
FROM registry1.dso.mil/ironbank/opensource/nginx/nginx:1.23.4

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/default.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/nginx/gzip.conf /etc/nginx/conf.d/gzip.conf

CMD ["nginx", "-g", "daemon off;"]
