import {DefaultCrudRepository} from '@loopback/repository';
import {Image} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Image, dataSource);
  }
}
