var models = require('../../models/index');
var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
  var page = req.query.page || 1;
  var count = req.query.count || 20;

  if (page < 1 || count < 1) {
    return res.json({
      result: 0,
      error: "Invalid page or count."
    })
  }

  models.events.findAll({
    include: [{ all: true }]
  }).then(function (events) {
    if (events) {
      var startIdx = (page - 1) * count;
      var endIdx = page * count;

      var totalPage = Math.ceil(events.length / count);
    }

    res.json({
      events: events.slice(startIdx, endIdx),
      page: page,
      total_page: totalPage
    });
  });
});

module.exports = router;