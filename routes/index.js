const pool = require("./../config/postgreConfig");
const express = require("express");
const {
  generateSuccessProbability,
  generateCodename,
  generateConfirmationCode,
} = require("./../utils/utilFunctions");

const router = express.Router();

router.get("/gadget", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM gadgets");
    const gadgets = result.rows.map((gadget) => ({
      ...gadget,
      generateSuccessProbability: generateSuccessProbability(),
    }));
    res.status(200).send(gadgets);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/gadget", async (req, res) => {
  const name = generateCodename();
  try {
    const result = await pool.query(
      "INSERT INTO gadgets (name, status) VALUES ($1, $2) RETURNING *",
      [name, "Available"]
    );
    res.status(201).send(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

router.patch("/gadgets/:id", async (req, res) => {
  const id = req.params.id;
  const newName = generateCodename();
  try {
    const result = await pool.query(
      "UPDATE gadgets SET name = COALESCE($1, name), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [newName, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Gadget not found" });

    res.status(201).send(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/gadgets/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE gadgets SET status = 'Decommissioned', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Gadget not found" });

    res.status(201).send(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
