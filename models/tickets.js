"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Tickets = sequelize.define('tickets', {
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    destination_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    members: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    arrival_datetime: {
      type: DataTypes.DATE,
      allowNull: false
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
      associate: function(models) {
        Tickets.belongsTo(models.users, {
          foreignKey: 'user_id'
        });
        Tickets.belongsTo(models.destinations, {
          foreignKey: 'destination_id'
        });
        Tickets.belongsTo(models.courses, {
          foreignKey: 'course_id'
        });
      }
    }
  });

  return Tickets;
};