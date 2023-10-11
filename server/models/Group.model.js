module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      group_id: {
        type: DataTypes.STRING(4),
        primaryKey: true,
      },
      group_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Group.associate = (models) => {
  //   Group.hasMany(models.Cake, {
  //     foreignKey: "group_id",
  //     as: "cakes",
  //   });
  // };

  return Group;
}
