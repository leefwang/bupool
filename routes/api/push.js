var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/send', function(req, res, next) {
  models.push_messages.findOne({
    include: [{ all: true }],
    where : {
      id: req.query.id
    }
  }).then(function (pushMessages) {
    models.devices.findAll({

    }).then(function (devices) {
      var gcm = require('node-gcm');
      var fs = require('fs');

      var message = new gcm.Message({
        collapseKey: 'demo',
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
          title: push_messages.title,
          message: push_messages.message
        }
      });

      var server_api_key = 'AIzaSyCU71ywHf21rf1QXGjcaBzKO5TKKNr96fw';
      var sender = new gcm.Sender(server_api_key);
      var registrationIds = [];

      for (var i = 0; i < devices.length; i++) {
        registrationIds.push(devices[i].token);
      }

      sender.send(message, registrationIds, 4, function (err, result) {
        console.log(result);
      });
    });
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