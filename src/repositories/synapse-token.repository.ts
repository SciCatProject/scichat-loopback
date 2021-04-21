import { inject } from "@loopback/core";
import { DefaultCrudRepository } from "@loopback/repository";
import { MongodbDataSource } from "../datasources";
import { SynapseToken, SynapseTokenRelations } from "../models";

export class SynapseTokenRepository extends DefaultCrudRepository<
  SynapseToken,
  typeof SynapseToken.prototype.id,
  SynapseTokenRelations
> {
  constructor(@inject("datasources.mongodb") dataSource: MongodbDataSource) {
    super(SynapseToken, dataSource);
  }
}
