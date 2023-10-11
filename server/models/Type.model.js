module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define(
    "Type",
    {
      type_id: {
        type: DataTypes.STRING(4),
        primaryKey: true,
      },
      type_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Type.associate = (models) => {
  //   Type.hasMany(models.Cake, {
  //     foreignKey: "type_id",
  //     as: "cakes",
  //   });
  // };

  return Type;
}
