import {
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from "@loopback/core";
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
  synapseToken: string;

  constructor(
    @inject("repositories.SynapseToken")
    protected synapseTokenRepositry: SynapseTokenRepository,
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
        this.synapseToken = tokenInstance.access_token;
        console.log("Found Synapse token", { synapseToken: this.synapseToken });
      } else {
        console.log("Synapse token not found, requesting new token");
        const synapseLoginResponse = await this.synapseService.login(
          this.username,
          this.password,
        );
        this.synapseToken = synapseLoginResponse.access_token;
        await this.synapseTokenRepositry.create(synapseLoginResponse);
        console.log("Request for new access token successful", {
          synapseToken: this.synapseToken,
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
