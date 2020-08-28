# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10.16.1-alpine

RUN apk update && apk upgrade && apk add --no-cache git

ENV NODE_ENV "production"
# Set to a non-root built-in user `node`
# USER node

# Create app directory (with user `node`)
# RUN mkdir -p /home/node/app

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/app/

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
RUN npm ci --only=production

# Bundle app source code
COPY . /usr/src/app/

# RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3030

EXPOSE ${PORT}
CMD [ "node", "." ]
