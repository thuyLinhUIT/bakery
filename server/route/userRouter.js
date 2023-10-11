module.exports = (() => {
  const router = require("express").Router();
  const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
  } = require("../controllers/userController");

  router.get("/allUsers", getAllUsers);
  router.get("/user/:id", getUserById);
  router.post("/user", createUser);
  router.post("/login", login);
  router.get("/login", (req, res) => res.end("this is login"))
  router.put("/user/:id", updateUser);
  router.delete("/user/:id", deleteUser);

  return router;
})();
