"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var CourseRequests = sequelize.define('course_requests', {
    event_id: {
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
    cdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment()
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      associate: function(models) {
        CourseRequests.hasOne(models.starting_points, {
          foreignKey: 'id'
        });
        CourseRequests.hasOne(models.destinations, {
          foreignKey: 'id'
        });
        CourseRequests.belongsTo(models.users, {
          foreignKey: 'user_id'
        });
      }
    }
  });

  return CourseRequests;
};