import { Sequelize } from "sequelize";

const db = new Sequelize("tasks_users_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;

import { Sequelize } from 'sequelize';
import 'dotenv/config';

const db = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

export default db;