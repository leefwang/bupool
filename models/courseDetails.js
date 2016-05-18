"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var CourseDetails = sequelize.define('course_details', {
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    next_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    destination_id: {
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

      }
    }
  });

  return CourseDetails;
};