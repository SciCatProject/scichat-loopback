# SciChat Wrapper API

[![Build Status](https://github.com/SciCatProject/scichat-loopback/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SciCatProject/scichat-loopback/actions)
[![DeepScan grade](https://deepscan.io/api/teams/8394/projects/16916/branches/371282/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8394&pid=16916&bid=371282)
[![Known Vulnerabilities](https://snyk.io/test/github/SciCatProject/scichat-loopback/master/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SciCatProject/scichat-loopback/master?targetFile=package.json)

Loopback API for communication between SciChat and Catamel.


## Get started

1. `git clone https://github.com/SciCatProject/scichat-loopback.git`
2. `npm install`
3. Add *.env* file to project root folder. Valid env varaibles:
   
   - `JWT_SECRET` [string] The secret for your JWT token, used for authorization.
   - `JWT_EXPIRES_IN` [string] How long, in seconds, the JWT token is valid.
   - `MONGODB_HOST` [string] The hostname/URL of your MongoDB.
   - `MONGODB_PORT` [number] The port used to access MongoDB.
   - `MONGODB_DB_NAME` [string] The name of the database where data from the app is stored.
   - `MONGODB_USER` [string] Username for the MongoDB user. Leave out or set to empty string if you don't have MongoDB authorization set up.
   - `MONGODB_PASSWORD` [string] Password for the MongoDB user. Leave out or set to empty string if you don't have MongoDB authorization set up.
   - `PORT` [number] The port that this service should be exposed on. Defaults to `3000` if value is not set.
   - `SCICHAT_USER` [string] The username of the user for this service. The app will create a user account with this username if this is the first time you run the app. If this is value is not set, the app will not start.
   - `SCICHAT_PASSWORD` [string] The password of the user for this service. The app will create a user account with this password if this is the first time you run the app.
   - `SYNAPSE_SERVER_NAME` [string] The name of of your Synapse server.
   - `SYNAPSE_SERVER_HOST` [string] The hostname/URL of your Synapse server.
   - `SYNAPSE_BOT_NAME` [string] The username of the account used for authenticating to your Synapse server.
   - `SYNAPSE_BOT_PASSWORD` [string] The password of the account used for authenticating to your Synapse server.
4. `npm start`


## Test the app

`npm run test`
