const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/utilFunctions");

const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.token) return res.redirect(500, "/");

  try {
    let decoded = verifyToken(req.cookies.token);
    const result = await pool.query(
      "SELECT * FROM user WHERE name = $1 AND id = $2",
      [decoded.name, decoded.id]
    );
    if (result.rowCount === 0)
      return res.status(403).send({ error: "Forbidden" });

    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect(500, "/");
  }
};

module.exports = isLoggedIn;
