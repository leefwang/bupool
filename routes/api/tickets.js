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
    }],
    where: {
      user_id: req.query.userId
    }
  }).then(function (ticket) {
    res.json({
      result: 1,
      ticket: ticket
    });
  });
});

module.exports = router;