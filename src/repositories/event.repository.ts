import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Event, Room} from '../models';
import {RoomRepository} from './room.repository';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id
> {
  public readonly room: BelongsToAccessor<Room, typeof Event.prototype.id>;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('RoomRepository')
    protected roomRepositoryGetter: Getter<RoomRepository>,
  ) {
    super(Event, dataSource);

    this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter);
  }
}
