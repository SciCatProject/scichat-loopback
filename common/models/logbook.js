'use strict';

const app = require('../../server/server');
const rison = require('rison');

const BOT_NAME = '@scicatbot:scicat03.esss.lu.se';
const IMAGE_MSGTYPE = 'm.image';

module.exports = function(Logbook) {
  /**
   * Find Logbook model instance by name
   * @param {string} name Name of the Logbook
   * @returns {Logbook} Logbook model instance
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
   * @returns {Logbook[]} Array of Logbook model instances
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
   * Filter Logbook entries matching query
   * @param {string} name The name of the Logbook
   * @param {string} filter Filter JSON object, keys: textSearch, showBotMessages, showUserMessages, showImages
   * @returns {Logbook} Filtered Logbook model instance
   */

  Logbook.filter = function(name, risonFilter) {
    let Room = app.models.Room;

    let filter = JSON.parse(rison.decode(risonFilter));
    let pattern = new RegExp('.*' + filter.textSearch + '.*', 'i');
    let queryFilter = {
      text: pattern,
    };

    if (filter.showBotMessages && filter.showUserMessages) {
      queryFilter.messageSenderToggle = {neq: null};
    } else if (!filter.showBotMessages && filter.showUserMessages) {
      queryFilter.messageSenderToggle = {neq: BOT_NAME};
    } else if (filter.showBotMessages && !filter.showUserMessages) {
      queryFilter.messageSenderToggle = BOT_NAME;
    } else if (!filter.showBotMessages && !filter.showUserMessages) {
      queryFilter.messageSenderToggle = null;
    } else {
      queryFilter.messageSenderToggle = {neq: null};
    }
    if (filter.showImages) {
      queryFilter.imagesToggle = IMAGE_MSGTYPE;

      return Room.findOne({
        where: {name: name},
        fields: ['id', 'name'],
        include: {
          relation: 'messages',
          scope: {
            fields: ['timestamp', 'sender', 'content'],
            order: 'timestamp ASC',
            where: {
              and: [
                {sender: queryFilter.messageSenderToggle},
                {'content.body': {like: queryFilter.text}},
              ],
            },
          },
        },
      });
    } else {
      queryFilter.imagesToggle = {neq: IMAGE_MSGTYPE};

      return Room.findOne({
        where: {name: name},
        fields: ['id', 'name'],
        include: {
          relation: 'messages',
          scope: {
            fields: ['timestamp', 'sender', 'content'],
            order: 'timestamp ASC',
            where: {
              and: [
                {sender: queryFilter.messageSenderToggle},
                {'content.body': {like: queryFilter.text}},
                {'content.msgtype': queryFilter.imagesToggle},
              ],
            },
          },
        },
      });
    }
  };
};
