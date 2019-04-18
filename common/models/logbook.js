'use strict';

const app = require('../../server/server');

const BOT_NAME = '@scicatbot:scicat03.esss.lu.se';
const IMAGE_MSGTYPE = 'm.image';

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
   * @returns {object} Filtered Logbook model instance
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

  /**
   * Filter Logbook entries matching query
   * @param {string} name The name of the Logbook
   * @param {string} query Query used to filter Logbook entries
   * @returns {object} Filtered Logbook model instance
   */

  Logbook.filterEntries = function(name, query) {
    let Room = app.models.Room;

    switch (query) {
      case 'Bot Messages': {
        return Room.findOne({
          where: {name: name},
          fields: ['id', 'name'],
          include: {
            relation: 'messages',
            scope: {
              fields: ['timestamp', 'sender', 'content'],
              order: 'timestamp ASC',
              where: {
                sender: {neq: BOT_NAME},
              },
            },
          },
        });
      }
      case 'User Messages': {
        return Room.findOne({
          where: {name: name},
          fields: ['id', 'name'],
          include: {
            relation: 'messages',
            scope: {
              fields: ['timestamp', 'sender', 'content'],
              order: 'timestamp ASC',
              where: {
                sender: BOT_NAME,
              },
            },
          },
        });
      }
      case 'Images': {
        return Room.findOne({
          where: {name: name},
          fields: ['id', 'name'],
          include: {
            relation: 'messages',
            scope: {
              fields: ['timestamp', 'sender', 'content'],
              order: 'timestamp ASC',
              where: {
                'content.msgtype': {neq: IMAGE_MSGTYPE},
              },
            },
          },
        });
      }
      default: {
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
      }
    }
  };
};
