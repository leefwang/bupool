var models = require('../../models');
var utils = require('../../utils');
var express = require('express');
var router = express.Router();

router.all('/send', function(req, res, next) {
  var push;
  var courseId = req.query.course_id || '';
  var destinationId = req.query.destination_id || '';

  models.push_messages.findOne({
    include: [{ all: true }],
    where : {
      id: req.query.push_id
    }
  }).then(function (pushMessage) {
    push = pushMessage;

    if (courseId !== '' && destinationId !== '') {
      models.tickets.findAll({
        include: [{
          model: models.users,
          include: [{
            model: models.devices
          }]
        }],
        where: {
          course_id: courseId,
          destination_id: destinationId
        }
      }).then(function (tickets) {
        var devices = [];

        for (var i = 0; i < tickets.length; i++) {
          for (var j = 0; j < tickets[i].user.devices.length; j++ ) {
            devices.push(tickets[i].user.devices[j]);
          }
        }

        utils.sendPush(push, devices);
      });
    } else {
      models.devices.findAll({

      }).then(function (devices) {
        utils.sendPush(push, devices);
      });
    }
  });
});

router.all('/add', function(req, res, next) {
  var push = models.push_messages.build({
    title: req.query.title,
    messages: req.query.messages
  });

  push.save().then(function() {

  }).catch(function() {

  });
});

module.exports = router;