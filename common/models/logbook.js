'use strict';

const app = require('../../server/server');

module.exports = function(Logbook) {
  /**
   * Find Logbook model instance by name
   * @param {string} name Name of the Logbook
   * @returns {object} Logbook model instance
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
   * @returns {array} Array of Logbook model instances
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

  /**
   * Find all Logbook entries matching the query
   * @param {string} name The name of the Logbook
   * @param {string} query Query of content in Logbook entry
   * @param {Function(Error, object)} callback
   */

  Logbook.findEntries = function(name, query) {
    let Room = app.models.Room;
    let pattern = new RegExp('.*' + query + '.*', 'i');
    return Room.findOne({
      where: {name: name},
      fields: ['id', 'name'],
      include: {
        relation: 'messages',
        scope: {
          fields: ['timestamp', 'sender', 'content'],
          order: 'timestamp ASC',
          where: {
            'content.body': {like: pattern},
          },
        },
      },
    });
  };
};
