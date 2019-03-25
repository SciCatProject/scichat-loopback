import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Message, Room} from '../models';
import {RoomRepository} from './room.repository';

export class MessageRepository extends DefaultCrudRepository<
  Message,
  typeof Message.prototype.id
> {
  public readonly room: BelongsToAccessor<Room, typeof Message.prototype.id>;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('RoomRepository')
    protected roomRepositoryGetter: Getter<RoomRepository>,
  ) {
    super(Message, dataSource);

    this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter);
  }
}
