var models = require('../../models');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var async = require('async');

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
  models.courses.findAll({
    where: {
      event_id: req.body.eid
    }
  }).then(function (courses) {

    async.each(courses, function (course) {
      var courseOfEvent = course;

      models.course_requests.findAll({
        where: {
          course_id: courseOfEvent.id,
          status: 'requested'
        },
        order: [
          ['udate', 'ASC']
        ]
      }).then(function (courseRequests) {
        var sumMembers = 0;

        async.each(courseRequests, function (courseRequest) {
          if (sumMembers + courseRequest.members <= courseOfEvent.max_members) {
            var ticket = models.tickets.build({
              course_id: courseRequest.course_id,
              destination_id: courseRequest.destination_id,
              user_id: courseRequest.user_id,
              members: courseRequest.members
            });

            ticket.save();

            courseRequest.update({
              status: 'ticketed'
            }, {fields: ['status']}).then(function() {

            });

            sumMembers += courseRequest.members;
            console.log("cid : ");
            console.log(courseRequest.course_id);
            console.log("total : ");
            console.log(sumMembers);
          } else {
            courseRequest.update({
              status: 'rejected'
            }, {fields: ['status']}).then(function() {

            });
          }
        });
      });
    });

    return res.json({
      result: 1
    });
  });
});

module.exports = router;