module.exports = (sequelize, DataTypes) => {
  const Cake = sequelize.define(
    "Cake",
    {
      cake_id: {
        type: DataTypes.STRING(4),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 1),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 1),
      },
    },
    {
      timestamps: false,
    }
  );

  return Cake;
};
