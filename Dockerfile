# Check out https://hub.docker.com/_/node to select a new base image
FROM node:14-alpine

RUN apk update && apk upgrade && apk add --no-cache git

ENV NODE_ENV "production"

# Prepare app directory
WORKDIR /home/node/app
COPY package*.json /home/node/app/
COPY .snyk /home/node/app/

# set up local user to avoid running as root
RUN chown -R node:node /home/node/app
USER node

# Install our packages
RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
RUN npm ci --only=production

# Bundle app source code
COPY --chown=node:node . /home/node/app/
COPY --chown=node:node server/config.local.js-sample /home/node/app/server/config.local.js

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3030
EXPOSE ${PORT}

# Start the app
CMD [ "node", "." ]
