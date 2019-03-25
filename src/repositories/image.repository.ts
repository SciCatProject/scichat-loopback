import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Image, Room} from '../models';
import {RoomRepository} from './room.repository';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id
> {
  public readonly room: BelongsToAccessor<Room, typeof Image.prototype.id>;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('RoomRepository')
    protected roomRepositoryGetter: Getter<RoomRepository>,
  ) {
    super(Image, dataSource);

    this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter);
  }
}
