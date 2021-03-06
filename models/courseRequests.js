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
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('requested','ticketed', 'rejected'),
      allowNull: false,
      defaultValue: 'requested'
    },
    cdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment(),
      get: function() {
        return moment(this.getDataValue('cdate')).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    udate: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue('udate')).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      associate: function(models) {
        CourseRequests.belongsTo(models.courses, {
          foreignKey: 'course_id'
        });
        CourseRequests.belongsTo(models.destinations, {
          foreignKey: 'destination_id'
        });
        CourseRequests.belongsTo(models.users, {
          foreignKey: 'user_id'
        });
      }
    }
  });

  return CourseRequests;
};