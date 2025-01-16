import mysql from "mysql";
import dotenv from "dotenv";

// Load environment variables
// dotenv.config();

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Create database connection
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
