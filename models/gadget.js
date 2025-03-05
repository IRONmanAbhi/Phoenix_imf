const pool = require("../config/postgreConfig");

const createTable = async () => {
  const query = `
      CREATE TYPE IF NOT EXISTS status_enum AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');
      CREATE TABLE IF NOT EXISTS model (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          status status_enum NOT NULL DEFAULT 'Available',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
  try {
    await pool.query(query);
    console.log("Table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createTable();
