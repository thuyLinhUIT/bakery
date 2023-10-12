const Group = require("../models").groups;

exports.getAllGroups = (req, res) => {
  Group.findAll().then((groups) => {
    res.status(200).json(groups);
  })
}

exports.getGroupById = (req, res) => {
  Group.findByPk(req.params.id).then((group) => {
    if (group) res.status(200).json(group);
    else
      res.status(404).json({
        success: false,
        message: "Group not found with id = " + req.params.id,
      });
  });

}
