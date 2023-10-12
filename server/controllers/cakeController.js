const Cake = require("../models").cakes;
const Group = require("../models").groups;
const Type = require("../models").types;
const { createCakeValidation } = require("../validations/auth.js");

exports.getAll = (req, res) => {
  console.log("all cake")
  Cake.findAll().then((cakes) => {
    res.status(200).json(cakes);
  });
};

exports.getCakeByGroupId = (req, res) => {
  console.log(req.params.groupid)
  Cake.findAll({
    where: {
      group_id: req.params.groupid
    }
  }).then((cakes) => {
    res.status(200).json(cakes);
  })
}

exports.getCakeById = (req, res) => {
  Cake.findByPk(req.params.id, {
    include: [
      {
        model: Group,
        attributes: ["group_name"],
      },
      {
        model: Type,
        attributes: ["type_name"],
      }
    ]
  }).then((cake) => {
    if (cake) res.status(200).json(cake);
    else
      res.status(404).json({
        success: false,
        message: "Cake not found with id = " + req.params.id,
      });
  });
};

exports.createCake = (req, res) => {
  const { error } = createCakeValidation(req.body);

  if (error)
    return res.status(422).json({
      success: false,
      message: error.details[0].message,
    });

  const newCake = {
    cake_id: Math.random().toString(36).substring(2, 6),
    name: req.body.name,
    group_id: req.body.group_id,
    type_id: req.body.type_id,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    unit: req.body.unit,
  };

  Cake.create(newCake)
    .then((cake) => {
      res.status(201).json({
        success: true,
        message: "Cake created successfully!",
        cake: cake,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error creating cake: " + err.message,
      });
    });
};

exports.deleteCake = async (req, res) => {
  const cakeId = req.params.id;
  Cake.findByPk(cakeId).then(result => Cake.destroy({
    where: { cake_id: cakeId },
  })
    .then((num) => {
      if (num > 0)
        res.status(200).json({
          success: true,
          message: "Cake deleted successfully",
          cake: result
        });
      else
        res.status(400).json({
          success: false,
          message: "Cake not found with id = " + cakeId,
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error deleting cake with id = " + cakeId,
        err: err.message,
      });
    }));
};

exports.updateCake = (req, res) => {
  const cakeId = req.params.id;

  const cake = {
    name: req.body.name,
    group_id: req.body.group_id,
    type_id: req.body.type_id,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    unit: req.body.unit
  };

  Cake.findByPk(cakeId).then(result => Cake.update(cake, {
    where: { cake_id: cakeId, group_id: req.body.group_id, type_id: req.body.type_id },
  })
    .then((num) => {
      if (num == 1)
        res.status(200).json({
          success: true,
          message: "Cake updated successfully",
          cake: cake
        });
      else
        res.status(400).json({
          success: false,
          message: "Cake not found with id = " + cakeId,
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error updating cake with id = " + cakeId,
        err: err.message,
      });
    }));

};

