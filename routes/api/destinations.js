var models = require('../../models/index');
var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
  models.destinations.findAll({
    include: [{ all: true }]
  }).then(function (destinations) {
    res.json({
      destinations: destinations
    });
  });
});

module.exports = router;