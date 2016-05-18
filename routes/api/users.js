var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/signin', function(req, res, next) {
  models.users.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (user) {
      if (user.password === req.body.password) {
        models.devices.findOne({
          where: {
            device: req.body.udid
          }
        }).then(function (device) {
          if (user.is_admin === 'Y') {
            return res.json({
              result: 4,
              user: user,
              device: device
            });
          } else {
            return res.json({
              result: 1,
              user: user,
              device: device
            });
          }
        }).catch(function(err) {
          return res.json({
            result: 0,
            err: err
          });
        });
      } else {
        return res.json({
          result: 3
        });
      }
    } else {
      return res.json({
        result: 2
      });
    }
  }).catch(function(err) {
    return res.json({
      result: 0,
      err: err
    });
  });
});

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
        return res.json({
          result: 1,
          user: user
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
