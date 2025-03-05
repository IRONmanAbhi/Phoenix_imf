const codeName = require("./codename");

const generateSuccessProbability = () =>
  `${Math.floor(Math.random() * 41) + 60}%`;

const generateCodename = () => {
  const name = "The " + codeName[Math.floor(Math.random() * names.length)];
  return name;
};

const generateConfirmationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) => {
  return jwt.sign({ name: user.name, id: user.id }, process.env.JWT_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
};

module.exports.generateSuccessProbability = generateSuccessProbability;
module.exports.generateCodename = generateCodename;
module.exports.generateConfirmationCode = generateConfirmationCode;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
