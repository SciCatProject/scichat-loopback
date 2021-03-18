"use strict";

module.exports = {
  synapse: {
    host: process.env.SYNAPSE_SERVER || "scitest.esss.lu.se",
    bot: {
      name: process.env.SYNAPSE_BOT_NAME || "scicatbot",
      password: process.env.SYNAPSE_BOT_PASSWORD || "scicatbot",
    },
  },
};
