'use strict';

module.exports = function(app) {
  const dataSource = app.datasources.mongo;
  console.log(
    'Datasource host %s, database %s',
    dataSource.connector.settings.host,
    dataSource.connector.settings.database
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
      console.error(`Error when creating User: ${err} ${user.username}`);
      return err;
    } else {
      if (created) {
        console.log('New account created:', user.username);
      } else {
        console.log('Account already exists:', user.username);
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
          console.log(`Error when creating Role: ${err} ${role.name}`);
          return err;
        } else {
          if (created) {
            console.log('New role created:', role.name);
          } else {
            console.log('Role already exists:', role.name);
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
              console.log(
                `Error when finding RoleMapping: ${err} ${roleInstance.id} ${
                  userInstance.id
                }`
              );
              return err;
            } else {
              if (created) {
                console.log(
                  'New rolemapping created:',
                  user.username,
                  role.name
                );
              } else {
                console.log(
                  'Rolemapping already exists:',
                  user.username,
                  role.name
                );
              }
            }
          });
        }
      });
    }
  });
};
