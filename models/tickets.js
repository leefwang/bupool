"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Tickets = sequelize.define('tickets', {
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
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
      associate: function(models) {
        Tickets.belongsTo(models.users, {
          foreignKey: 'id'
        });
        Tickets.belongsTo(models.courses, {
          foreignKey: 'course_id'
        });
      }
    }
  });

  return Tickets;
};