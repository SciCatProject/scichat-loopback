import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './synapse.datasource.json';

export class SynapseDataSource extends juggler.DataSource {
  static dataSourceName = 'Synapse';

  constructor(
    @inject('datasources.config.Synapse', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
