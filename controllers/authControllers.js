const pool = require("./../config/postgreConfig");
const { generateToken } = require("./../utils/utilFunctions");

const registerUser = async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO imfusers (name, password) VALUES ($1, $2) RETURNING *",
      [name, password]
    );
    res.status(201).send(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM imfusers WHERE name = $1 AND password = $2",
      [name, password]
    );
    if (result.rowCount === 0)
      return res.status(404).send({ error: "User not found" });

    let token = generateToken(result.rows[0]);
    res.cookie("token", token);
    res.redirect("/gadget");
  } catch (error) {
    res.status(500).json({ error: "Database error", message: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
