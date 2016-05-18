var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/put', function(req, res, next) {
  models.devices.findOne({
    where: {
      device: req.body.udid
    }
  }).then(function (device) {
    if (device) {
      return res.json({
        result: 2
      })
    } else {
      models.users.findOne({
        where: {
          email: req.body.email
        }
      }).then(function (user) {
        if (user) {
          var device = models.devices.build({
            user_id: user.id,
            device: req.body.udid,
            token: req.body.deviceToken,
            platform: req.body.platform
          });

          device.save().then(function() {
            return res.json({
              result: 1,
              device: device
            });
          }).catch(function(err) {
            return res.json({
              result: 0,
              err: err
            });
          });
        } else {
          return res.json({
            result: 3
          })
        }
      }).catch(function(err) {
        return res.json({
          result: 0,
          err: err
        });
      });
    }
  }).catch(function(err) {
    return res.json({
      result: 0,
      err: err
    });
  });
});

router.all('/push', function(req, res, next) {
  var gcm = require('node-gcm');

// create a message with default values
  var message = new gcm.Message();

// or with object values
  var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      key1: '안녕하세요.',
      key2: 'saltfactory push demo'
    }
  });

  var server_access_key = '푸시 프로바이더 서버 access key 값';
  var sender = new gcm.Sender(server_access_key);
  var registrationIds = [];

  var registration_id = '안드로이드 registration_id 값';
// At least one required
  registrationIds.push(registration_id);

  /**
   * Params: message-literal, registrationIds-array, No. of retries, callback-function
   **/
  sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
  });
});

module.exports = router;