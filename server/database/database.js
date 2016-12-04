var Sequelize = require('sequelize');
var yourDB; //Set this to the URL to your database
var sequelize = new Sequelize(yourDB, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

module.exports = sequelize;