export const testdbConfig = {
  name: "mongodb",
  connector: "mongodb",
  host: process.env.MONGODB_HOST ?? "mongodb",
  port: process.env.MONGODB_PORT ?? 27017,
  user: process.env.MONGODB_USER ?? "",
  password: process.env.MONGODB_PASSWORD ?? "",
  database: "test",
  useNewUrlParser: true,
};
