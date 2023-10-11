const router = require("express").Router();
const {
  getAll,
  getCakeById,
  createCake,
  updateCake,
  deleteCake,
  getCakeByGroupId
} = require("../controllers/cakeController");

router.get("/allCake", getAll);
router.get("/cake/:id", getCakeById);
router.get("/cake/group/:groupid", getCakeByGroupId)
router.post("/cake", createCake);
router.put("/cake/:id", updateCake);
router.delete("/cake/:id", deleteCake);

module.exports = router;
