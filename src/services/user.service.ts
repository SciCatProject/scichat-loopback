import { UserService } from "@loopback/authentication";
import { repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";
import { securityId, UserProfile } from "@loopback/security";
import { compare } from "bcryptjs";
import { User, UserWithRelations } from "../models";
import { UserRepository } from "../repositories";

export type Credentials = {
  username: string;
  password: string;
};

export class SciChatUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = "Invalid username or password";

    const foundUser = await this.userRepository.findOne({
      where: { username: credentials.username },
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id.toString(),
      name: user.username,
      id: user.id,
      email: user.email,
    };
  }

  async findUserById(id: string): Promise<User & UserWithRelations> {
    const userNotFound = "invalid User";
    const foundUser = await this.userRepository.findOne({ where: { id: id } });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotFound);
    }
    return foundUser;
  }
}
