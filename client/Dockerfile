FROM cgr.dev/chainguard/node:latest AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY --chown=node:node public ${APP_HOME}/public
COPY --chown=node:node src ${APP_HOME}/src
COPY --chown=node:node nginx ${APP_HOME}/nginx
COPY --chown=node:node package.json ${APP_HOME}/package.json
COPY --chown=node:node vite.config.js ${APP_HOME}/vite.config.js
COPY --chown=node:node index.html ${APP_HOME}/index.html

# Install dependencies
USER root
RUN npm install

# Build the React app
RUN npm run build

# Stage 2 - NGINX
FROM cgr.dev/chainguard/nginx:latest-dev

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
