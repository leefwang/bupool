var models = require('../../models/index');
var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
  models.tickets.findOne({
    include: [{ all: true }],
    where: {
      id: req.query.userId
    }
  }).then(function (ticket) {
    res.json({
      result: 1,
      ticket: ticket
    });
  });
});

module.exports = router;