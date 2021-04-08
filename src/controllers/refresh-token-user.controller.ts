import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RefreshToken,
  User,
} from '../models';
import {RefreshTokenRepository} from '../repositories';

export class RefreshTokenUserController {
  constructor(
    @repository(RefreshTokenRepository)
    public refreshTokenRepository: RefreshTokenRepository,
  ) { }

  @get('/refresh-tokens/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to RefreshToken',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof RefreshToken.prototype.id,
  ): Promise<User> {
    return this.refreshTokenRepository.user(id);
  }
}
