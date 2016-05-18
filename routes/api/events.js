var models = require('../../models');
var express = require('express');
var router = express.Router();
var moment = require('moment');

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
      for (var i = 0; i < events.length; i++) {
        events[i].dataValues.event_datetime = moment(events[i].event_datetime).format("YYYY-MM-DD HH:mm:ss");
        events[i].dataValues.depart_datetime = moment(events[i].depart_datetime).format("YYYY-MM-DD HH:mm:ss");
        events[i].dataValues.cdate = moment(events[i].cdate).format("YYYY-MM-DD HH:mm:ss");
      }

      var startIdx = (page - 1) * count;
      var endIdx = page * count;

      var totalPage = Math.ceil(events.length / count);
    }

    res.json({
      result: 1,
      events: events.slice(startIdx, endIdx),
      page: page,
      total_page: totalPage
    });
  });
});

module.exports = router;