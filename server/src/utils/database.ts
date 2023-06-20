import { DataSource } from "typeorm";

const DataBase = new DataSource({
  type: "postgres",
  // FIXME: not working with postgres_db inside Docker but it should
  host: "localhost", // postgres_db
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

export default DataBase;
