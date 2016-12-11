var Sequelize = require('sequelize');
var yourDB = "INSERT YOUR POSTGRES LINK HERE!";
var sequelize = new Sequelize(yourDB, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

module.exports = sequelize;