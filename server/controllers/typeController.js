const Type = require("../models").types;
exports.getAllTypes = (req, res) => {
  Type.findAll().then((types) => {
    res.status(200).json({
      success: true,
      types: types
    });
  })
}
