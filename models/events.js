"use strict";

var models = require('../models');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Events = sequelize.define('events', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function() {
        return moment(this.getDataValue('cdate')).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    depart_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function() {
        return moment(this.getDataValue('cdate')).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    starting_point_id: {
      type: DataTypes.INTEGER,
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
        Events.belongsTo(models.starting_points, {
          foreignKey: 'starting_point_id'
        });
      }
    }
  });

  return Events;
};