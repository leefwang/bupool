"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Devices = sequelize.define('devices', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING
    },
    platform: {
      type: DataTypes.STRING
    },
    flag: {
      type: DataTypes.INTEGER
    },
    cdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment()
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      associate: function(models) {
        Devices.belongsTo(models.users, {
          foreignKey: 'user_id'
        });
      }
    }
  });

  return Devices;
};