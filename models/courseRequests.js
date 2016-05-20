"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var CourseRequests = sequelize.define('course_requests', {
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
    is_used: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
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
      associate: function(models) {
        CourseRequests.hasOne(models.starting_points, {
          foreignKey: 'id'
        });
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