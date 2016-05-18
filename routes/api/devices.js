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

module.exports = router;