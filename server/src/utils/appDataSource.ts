import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "foodie",
  synchronize: true,
  logging: false,
  entities: ["./src/entity/*.ts"],
  subscribers: [],
  migrations: []
});

export default AppDataSource;
