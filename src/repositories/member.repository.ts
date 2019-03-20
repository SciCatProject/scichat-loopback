import {DefaultCrudRepository} from '@loopback/repository';
import {Member} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Member, dataSource);
  }
}
