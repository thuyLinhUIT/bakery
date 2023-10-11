module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: Sequelize.STRING(5),
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    bio: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    birth_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  return User;
};
