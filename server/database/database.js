var Sequelize = require('sequelize');
var yourDB = "postgres://blonstyjlevsxf:xh9kadztg8U0BfQTt3g-SeZ3vo@ec2-107-22-223-6.compute-1.amazonaws.com:5432/d3c5dnu383ku2t";
var sequelize = new Sequelize(yourDB, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

module.exports = sequelize;