"use strict";

const app = require("../../server/server");

module.exports = function(Logbook) {
  /**
   * Find Logbook model instance by name
   * @param {string} name The name of the Logbook
   */

  Logbook.findByName = function(name) {
    let Room = app.models.Room;
    return Room.find({
      where: { name: name },
      fields: ["id", "name"],
      include: {
        relation: "messages",
        scope: { fields: ["timestamp", "sender", "content"] }
      }
    });
  };
};
