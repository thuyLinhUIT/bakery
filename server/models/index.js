const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   "mssql://sa:2@localhost/Bakery?TrustServerCertificate=true&encrypt=false&Trusted_Connection=true"
// );
//
const sequelize = new Sequelize('Bakery', 'bakeryadmin', 'Hamili123', {
  host: 'hamilidemo.database.windows.net',
  dialect: 'mssql',
  port: 1433,
  trustServerCertificate: true,
  // pool: {
  //   max: 5,
  //   min: 0,
  //   idle: 10000
  // },
  dialectOptions: {
    encrypt: true
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.cakes = require("./Cake.model")(sequelize, Sequelize);
db.users = require("./User.model")(sequelize, Sequelize);
db.groups = require("./Group.model")(sequelize, Sequelize);
db.types = require("./Type.model")(sequelize, Sequelize);

db.cakes.belongsTo(db.types, {
  foreignKey: "type_id",
});
db.cakes.belongsTo(db.groups, {
  foreignKey: "group_id",
});
db.types.belongsTo(db.groups, {
  foreignKey: "group_id",
});


module.exports = db;
