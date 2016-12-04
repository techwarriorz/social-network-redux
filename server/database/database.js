var Sequelize = require('sequelize');
var yourDB = "Your Postgres Database";
var sequelize = new Sequelize(yourDB, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

module.exports = sequelize;