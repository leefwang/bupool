var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/:id', function(req, res, next) {
  models.starting_points.findOne({
    include: [{ all: true }],
    where: {
      id: req.params.id
    }
  }).then(function (startingPoint) {
    res.json({
      result: 1,
      startingPoint: startingPoint
    });
  });
});

module.exports = router;