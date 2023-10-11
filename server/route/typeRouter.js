const router = require("express").Router();
const {
  getAllTypes
} = require("../controllers/typeController");

router.get("/allType", getAllTypes)

module.exports = router;
