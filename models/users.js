"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
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

  return Users;
};