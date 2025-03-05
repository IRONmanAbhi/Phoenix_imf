const express = require("express");
const {
  addGadget,
  showGadget,
  updateGadget,
  deleteGadget,
  selfDestruct,
} = require("./../controllers/gadgetControllers");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("./../controllers/authControllers");
const isLoggedIn = require("./../middleware/isLoggedIn");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Welcome to Pheonix IMF");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/gadget", isLoggedIn, showGadget);
router.post("/gadget", isLoggedIn, addGadget);
router.patch("/gadget/:id", isLoggedIn, updateGadget);
router.delete("/gadget/:id", isLoggedIn, deleteGadget);
router.post("/gadget/:id/self-destruct", isLoggedIn, selfDestruct);
module.exports = router;
