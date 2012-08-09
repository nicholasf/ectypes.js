var async = require('async');
var Sequelize = require('sequelize');

sequelizeStrategy = {};


sequelizeStrategy.overrideProperty = function (obj, property, value){ 
	obj.set(property, value);
	return obj;
} 

for (var prop in sequelizeStrategy){exports[prop] = sequelizeStrategy[prop];}
