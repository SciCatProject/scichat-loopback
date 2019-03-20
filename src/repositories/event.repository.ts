import {DefaultCrudRepository} from '@loopback/repository';
import {Event} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Event, dataSource);
  }
}
