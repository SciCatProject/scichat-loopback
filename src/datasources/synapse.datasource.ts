import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'synapse',
  connector: 'rest',
  baseURL: 'https://scitest.esss.lu.se/_matrix/client/r0/',
  crud: false
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SynapseDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'synapse';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.synapse', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
