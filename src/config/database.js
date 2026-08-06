import { Sequelize } from "sequelize";

const db = new Sequelize("tasks_users_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
