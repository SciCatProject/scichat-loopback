import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {Event, Room} from '../models';
import {EventRepository} from './event.repository';

export class RoomRepository extends DefaultCrudRepository<
  Room,
  typeof Room.prototype.id
> {
  public readonly events: HasManyRepositoryFactory<
    Event,
    typeof Room.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter(EventRepository)
    protected eventRepositoryGetter: Getter<EventRepository>,
  ) {
    super(Room, dataSource);
    this.events = this.createHasManyRepositoryFactoryFor(
      'events',
      eventRepositoryGetter,
    );
  }
}
