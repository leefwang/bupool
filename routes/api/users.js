var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/signup', function(req, res, next) {
  models.users.findAll({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (user.length > 0) {
      return res.json({
        result: 2,
        user: user
      });
    } else {
      var user = models.users.build({
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
      });

      user.save().then(function() {
        var device = models.devices.build({
          user_id: user.id,
          device: req.body.udid,
          platform: req.body.platform
        });

        device.save().then(function() {
          return res.json({
            result: 1,
            user: user,
            device: device
          });
        }).catch(function(err) {
          return res.json({
            result: 0,
            err: err
          });
        });
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
