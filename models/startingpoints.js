"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var StartingPoints = sequelize.define('starting_points', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    cdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment()
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {

    }
  });

  return StartingPoints;
};