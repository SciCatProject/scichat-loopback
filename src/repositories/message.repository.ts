import {DefaultCrudRepository} from '@loopback/repository';
import {Message} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MessageRepository extends DefaultCrudRepository<
  Message,
  typeof Message.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Message, dataSource);
  }
}
