import {
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from "@loopback/core";
import { repository } from "@loopback/repository";
import _ from "lodash";
import { SynapseTokenRepository } from "../repositories";
import { SynapseService } from "../services";

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({ tags: { key: LogbookInterceptor.BINDING_KEY } })
export class LogbookInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${LogbookInterceptor.name}`;
  username = process.env.SYNAPSE_BOT_NAME ?? "";
  password = process.env.SYNAPSE_BOT_PASSWORD ?? "";
  serverName = process.env.SYNAPSE_SERVER_NAME ?? "ess";

  constructor(
    @repository(SynapseTokenRepository)
    public synapseTokenRepositry: SynapseTokenRepository,
    @inject("services.Synapse") protected synapseService: SynapseService,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      console.log("Looking for Synapse token in database");
      const userId = `@${this.username}:${this.serverName}`;
      const tokenInstance = await this.synapseTokenRepositry.findOne({
        where: { user_id: userId },
      });
      if (tokenInstance && tokenInstance.user_id === userId) {
        console.log("Found Synapse token", {
          synapseToken: tokenInstance.access_token,
        });
      } else {
        console.log("Synapse token not found, requesting new token");
        const synapseLoginResponse = await this.synapseService.login(
          this.username,
          this.password,
        );
        await this.synapseTokenRepositry.create(
          _.omit(synapseLoginResponse, "well_known"),
        );
        console.log("Request for new access token successful", {
          synapseToken: synapseLoginResponse.access_token,
        });
      }
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      console.error(err);
      // Add error handling logic here
    }
  }
}
