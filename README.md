# SciChat Wrapper API

[![Build Status](https://github.com/SciCatProject/scichat-loopback/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SciCatProject/scichat-loopback/actions)
[![DeepScan grade](https://deepscan.io/api/teams/8394/projects/16916/branches/371282/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8394&pid=16916&bid=371282)
[![Known Vulnerabilities](https://snyk.io/test/github/SciCatProject/scichat-loopback/master/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SciCatProject/scichat-loopback/master?targetFile=package.json)

Loopback API for communication between SciChat and Catamel.

## Get started

1. `git clone https://github.com/SciCatProject/scichat-loopback.git`
2. `npm install`
3. Add _.env_ file to project root folder. See [Environment Variables](#environment-variables).
4. `npm start`

## Test the app

`npm run test`

## Environment Variables

Valid environment variables for the _.env_ file.

### SciChat-LoopBack

- `PORT` [number] The port that this service should be exposed on. Defaults to `3000` if value is not set.

### RabbitMQ

- `RABBITMQ_ENABLED` [string] Toggles RabbitMQ consumer. Valid values are `"yes"` and `"no"`. Defaults to `"no"`.
- `RABBITMQ_HOST` [string] The hostname/URL of your RabbitMQ. Defaults to `"localhost"`.
- `RABBITMQ_USER` [string] Username of the RabbitMQ user.
- `RABBITMQ_PASSWORD` [string] Password of the RabbitMQ user.
- `DEFAULT_PASSWORD` [string] The default password for new SciChat users created from the RabbitMQ message queue

### Synapse

- `SYNAPSE_SERVER_NAME` [string] The name of of your Synapse server.
- `SYNAPSE_SERVER_HOST` [string] The hostname/URL of your Synapse server.
- `SYNAPSE_BOT_NAME` [string] The username of the account used for authenticating to your Synapse server.
- `SYNAPSE_BOT_PASSWORD` [string] The password of the account used for authenticating to your Synapse server.
