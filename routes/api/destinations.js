var models = require('../../models');
var express = require('express');
var moment = require('moment');
var router = express.Router();

router.all('/', function(req, res, next) {
  models.destinations.findAll({
    include: [{ all: true }]
  }).then(function (destinations) {
    res.json({
      result: 1,
      destinations: destinations
    });
  });
});

router.all('/requiredtime', function(req, res, next) {
  models.courses.findAll({
    include: [{
      model: models.course_details,
      where: {
        destination_id: req.body.destination_id
      }
    }],
    where: {
      event_id: req.body.event_id
    }
  }).then(function (courses) {
    var longestTime = [0, 0, 0];
    var longestTimeString = "";

    for (var i = 0; i < courses.length; i++) {
      var temp = courses[i].course_details[0].required_time_sum.split(":");

      for (var j = 0; j < temp.length; j++) {
        if (parseInt(temp[j]) > longestTime[j]) {
          longestTime = temp.slice(0);
          j = temp.length;
        }
      }
    }

    for (var k = 0; k < longestTime.length; k++) {
      longestTimeString += longestTime[k].toString();

      if(k < longestTime.length - 1) {
        longestTimeString += ":";
      }
    }

    res.json({
      result: 1,
      longestTime: longestTimeString
    });
  });
});

module.exports = router;