var models = require('../../models/index');
var express = require('express');
var router = express.Router();

router.post('/:id', function(req, res, next) {
  models.starting_points.findOne({
    include: [{ all: true }],
    where: {
      id: req.params.id
    }
  }).then(function (startingPoint) {
    res.json({
      startingPoint: startingPoint
    });
  });
});

module.exports = router;