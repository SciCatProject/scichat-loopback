'use strict';

const app = require('../../server/server');

module.exports = function(Logbook) {
  /**
   * Find Logbook model instance by name
   * @param {string} name The name of the Logbook
   */

  Logbook.findByName = function(name) {
    let Room = app.models.Room;
    return Room.findOne({
      where: {name: name},
      fields: ['id', 'name'],
      include: {
        relation: 'messages',
        scope: {
          fields: ['timestamp', 'sender', 'content'],
          order: 'timestamp ASC',
        },
      },
    });
  };

  /**
   * Find all Logbook model instances
   */

  Logbook.findAll = function() {
    let Room = app.models.Room;
    return Room.find({
      fields: ['id', 'name'],
      include: {
        relation: 'messages',
        scope: {
          fields: ['timestamp', 'sender', 'content'],
          order: 'timestamp ASC',
        },
      },
    });
  };
};
