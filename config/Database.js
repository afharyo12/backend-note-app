import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DB_DATABASE || "db_invenotry",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root", // Default to 'root'
  {
    // The most important line: Use the environment variable!
    host: process.env.DB_HOST || 'localhost', 
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql'
  }
);

export default db;
