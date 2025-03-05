const pool = require("../config/postgreConfig");

const createTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS imfusers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  try {
    await pool.query(query);
    console.log("Table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

module.exports = createTable;
