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
    is_admin: {
      type: DataTypes.STRING,
      defaultValue: 'N'
    },
    cdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment(),
      get: function() {
        return moment(this.getDataValue('cdate')).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {

    }
  });

  return Users;
};