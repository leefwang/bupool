"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Courses = sequelize.define('courses', {
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    course_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    flag: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: 'N'
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
        Courses.belongsTo(models.events, {
          foreignKey: 'event_id'
        });
      }
    }
  });

  return Courses;
};