// src/data-source.ts
import { DataSource } from "typeorm";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "fanera_db",
  synchronize: false,
  logging: false,
  entities: ["src/**/**.entity.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
