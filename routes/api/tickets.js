var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
  models.tickets.findAll({
    include: [{
      model: models.courses,
      include: [{
        model: models.events,
        include: [{
          model: models.starting_points
        }]
      }]
    },{
      model: models.destinations
    }],
    where: {
      user_id: req.body.userId
    }
  }).then(function (tickets) {
    if (tickets.length > 0) {
      res.json({
        result: 1,
        tickets: tickets
      });
    } else {
      res.json({
        result: 0,
        tickets: tickets
      });
    }
  });
});

module.exports = router;