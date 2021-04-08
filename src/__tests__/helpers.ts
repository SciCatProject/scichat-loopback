import { genSalt, hash } from "bcryptjs";
import { MongodbDataSource } from "../datasources";
import { User, UserCredentials } from "../models";
import {
  RefreshTokenRepository,
  UserCredentialsRepository,
  UserRepository,
} from "../repositories";
import { testdb } from "./fixtures/datasources/testdb.datasource";

const mongodb = new MongodbDataSource(testdb);

const userRepository = new UserRepository(
  mongodb,
  async () => userCredentialsRepository,
);

const userCredentialsRepository = new UserCredentialsRepository(mongodb);

const refreshTokenRepository = new RefreshTokenRepository(
  mongodb,
  async () => userRepository,
);

export async function givenEmptyDatabase() {
  await userRepository.deleteAll();
  await userCredentialsRepository.deleteAll();
  await refreshTokenRepository.deleteAll();
}

export function givenUserData(data?: Partial<User>) {
  return Object.assign(
    {
      username: "testUser",
      email: "test@email.com",
    },
    data,
  );
}

export async function givenUser(data?: Partial<User>) {
  return userRepository.create(givenUserData(data));
}

export async function givenUserCredentialsData(
  data?: Partial<UserCredentials>,
) {
  return Object.assign(
    {
      password: await hash("password", await genSalt()),
    },
    data,
  );
}

export async function givenUserCredentials(data?: Partial<UserCredentials>) {
  return userCredentialsRepository.create(await givenUserCredentialsData(data));
}

export async function givenUserAccount() {
  const user = await givenUser();
  return givenUserCredentials({ userId: user.id });
}

export function givenCredentials() {
  return { username: "testUser", password: "password" };
}
