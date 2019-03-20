import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {Event, Member, Message, Room} from '../models';
import {EventRepository} from './event.repository';
import {MemberRepository} from './member.repository';
import {MessageRepository} from './message.repository';

export class RoomRepository extends DefaultCrudRepository<
  Room,
  typeof Room.prototype.id
> {
  public readonly events: HasManyRepositoryFactory<
    Event,
    typeof Room.prototype.id
  >;
  public readonly members: HasManyRepositoryFactory<
    Member,
    typeof Room.prototype.id
  >;
  public readonly messages: HasManyRepositoryFactory<
    Message,
    typeof Room.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter(EventRepository)
    protected eventRepositoryGetter: Getter<EventRepository>,
    @repository.getter(MemberRepository)
    protected memberRepositoryGetter: Getter<MemberRepository>,
    @repository.getter(MessageRepository)
    protected messageRepositoryGetter: Getter<MessageRepository>,
  ) {
    super(Room, dataSource);
    this.events = this.createHasManyRepositoryFactoryFor(
      'events',
      eventRepositoryGetter,
    );
    this.members = this.createHasManyRepositoryFactoryFor(
      'members',
      memberRepositoryGetter,
    );
    this.messages = this.createHasManyRepositoryFactoryFor(
      'messages',
      messageRepositoryGetter,
    );
  }
}
