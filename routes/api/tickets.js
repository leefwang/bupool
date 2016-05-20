var models = require('../../models');
var express = require('express');
var router = express.Router();
var moment = require('moment');

router.all('/', function(req, res, next) {
  models.users.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (user) {
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
          user_id: user.id
        }
      }).then(function (tickets) {
        if (tickets.length > 0) {
          for (var i = 0; i < tickets.length; i++) {
            tickets[i].course.event.depart_datetime = moment(tickets[i].course.event.depart_datetime).format("YYYY-MM-DD HH:mm:ss");
          }

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
    } else {
      res.json({
        result: 0
      });
    }
  });
});

router.all('/ticketing', function(req, res, next) {
  models.course_requests.findAll({
    where: {
      course_id: req.body.cid,
      is_used: 'N'
    }
  }).then(function (courseRequests) {
    for (var i = 0; i < courseRequests.length; i++) {
      var ticket = models.tickets.build({
        course_id: req.body.cid,
        destination_id: courseRequests[i].dataValues.destination_id,
        user_id: courseRequests[i].dataValues.user_id
      });

      courseRequests[i].update({
        is_used: 'Y'
      }, {fields: ['is_used']}).then(function() {

      });

      ticket.save().then(function() {

      });
    }

    res.redirect('/ticket');
  });
});

module.exports = router;