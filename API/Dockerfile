FROM cgr.dev/chainguard/node:latest

WORKDIR /app

COPY --chown=node:node models /app/models
COPY --chown=node:node routes /app/routes
COPY --chown=node:node utils /app/utils
COPY --chown=node:node server.js /app/
COPY --chown=node:node package.json /app/
COPY --chown=node:node processes.json /app/

# Install Dependencies
RUN npm install --omit=dev
EXPOSE 4000

# Make Entry Point NPM
ENTRYPOINT ["npm", "run"]

# Run Script
CMD ["pm2-prod"]
