const pool = require("./../config/postgreConfig");
const {
  generateSuccessProbability,
  generateCodename,
  generateConfirmationCode,
} = require("./../utils/utilFunctions");

const showGadget = async (req, res) => {
  const status = req.query.status;
  try {
    let query = "SELECT * FROM gadgets";
    let values = [];

    if (status) {
      query += " WHERE status = $1";
      values.push(status);
    }

    const result = await pool.query(query, values);
    if (result.rowCount === 0)
      return res.status(200).send("No Gadget At the moment");
    const gadgets = result.rows.map((gadget) => ({
      ...gadget,
      generateSuccessProbability: generateSuccessProbability(),
    }));
    res.status(200).send(gadgets);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

const addGadget = async (req, res) => {
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
};

const updateGadget = async (req, res) => {
  const id = req.params.id;
  const newName = generateCodename();
  try {
    const result = await pool.query(
      "UPDATE gadgets SET name = COALESCE($1, name), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [newName, id]
    );
    if (result.rowCount === 0)
      return res.status(404).send({ error: "Gadget not found" });

    res.status(201).send(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

const deleteGadget = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE gadgets SET status = 'Decommissioned', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).send({ error: "Gadget not found" });

    res.status(201).send(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

const selfDestruct = async (req, res) => {
  const id = req.params.id;

  const confirmationCode = generateConfirmationCode();
  try {
    const gadgetCheck = await pool.query(
      "SELECT * FROM gadgets WHERE id = $1",
      [id]
    );

    if (gadgetCheck.rowCount === 0)
      return res.status(404).send({ error: "Gadget not found" });

    // we send the code to user and he could enter in front end then if req.body.code === confirmationCode
    if (confirmationCode) {
      const result = await pool.query(
        "UPDATE gadgets SET status = 'Destroyed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rowCount === 0)
        return res.status(404).send({ error: "Gadget not found" });

      res.status(201).send(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

module.exports.addGadget = addGadget;
module.exports.showGadget = showGadget;
module.exports.updateGadget = updateGadget;
module.exports.deleteGadget = deleteGadget;
module.exports.selfDestruct = selfDestruct;
