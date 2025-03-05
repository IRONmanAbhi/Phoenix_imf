const pool = require("../config/postgreConfig");

const createTable = async () => {
  try {
    await pool.query(`
      DO $$ 
      BEGIN 
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN 
              CREATE TYPE status_enum AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned'); 
          END IF; 
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gadgets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          status status_enum NOT NULL DEFAULT 'Available'::status_enum,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

module.exports = createTable;
