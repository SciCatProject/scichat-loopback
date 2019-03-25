import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Member, Room} from '../models';
import {RoomRepository} from './room.repository';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.id
> {
  public readonly room: BelongsToAccessor<Room, typeof Member.prototype.id>;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('RoomRepository')
    protected roomRepositoryGetter: Getter<RoomRepository>,
  ) {
    super(Member, dataSource);

    this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter);
  }
}
