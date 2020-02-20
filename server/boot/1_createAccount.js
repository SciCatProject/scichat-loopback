'use strict';

const logger = require('../../common/logger');

module.exports = function(app, next) {
  const dataSource = app.datasources.mongo;
  logger.logInfo(
    'Datasource host: ' +
      dataSource.connector.settings.host +
      ', database: ' +
      dataSource.connector.settings.database,
    {}
  );

  const User = app.models.User;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  const account = {
    user: 'logbookReader',
    password: 'logrdr',
    email: 'logbookReader@esss.se',
    role: 'logbookReader',
  };

  const user = {
    username: account.user,
    password: account.password,
    email: account.email,
    emailVerified: true,
  };

  const userFilter = {
    where: {
      username: user.username,
    },
  };

  User.findOrCreate(userFilter, user, function(err, userInstance, created) {
    if (err) {
      logger.logError(err.message, {
        location: 'User.findOrCreate',
        userFilter,
        user,
      });
      return err;
    } else {
      if (created) {
        logger.logInfo('New account created', {user});
      } else {
        logger.logInfo('Account already exists', {user});
      }

      const role = {
        name: account.role,
      };

      const roleFilter = {
        where: {
          name: account.role,
        },
      };

      Role.findOrCreate(roleFilter, role, function(err, roleInstance, created) {
        if (err) {
          logger.logError(err.message, {
            location: 'Role.findOrCreate',
            roleFilter,
            role,
          });
          return err;
        } else {
          if (created) {
            logger.logInfo('New role created', {role});
          } else {
            logger.logInfo('Role already exists', {role});
          }

          const mappingFilter = {
            where: {
              roleId: roleInstance.id,
              principalId: String(userInstance.id),
            },
          };

          const mapping = {
            principalType: RoleMapping.USER,
            principalId: userInstance.id,
            roleId: roleInstance.id,
          };

          RoleMapping.findOrCreate(mappingFilter, mapping, function(
            err,
            mappingInstance,
            created
          ) {
            if (err) {
              logger.logError(err.message, {
                location: 'RoleMapping.findOrCreate',
                mappingFilter,
                mapping,
                roleInstance,
                userInstance,
              });
              return err;
            } else {
              if (created) {
                logger.logInfo('New rolemapping created', {user, role});
              } else {
                logger.logInfo('Rolemapping already exists', {user, role});
              }
            }
            return next();
          });
        }
      });
    }
  });
};
