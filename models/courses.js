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
    min_members: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_members: {
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
      defaultValue: moment(),
      get: function() {
        return moment(this.getDataValue('cdate')).format("YYYY-MM-DD HH:mm:ss");
      }
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