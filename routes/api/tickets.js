var models = require('../../models');
var utils = require('../../utils');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var async = require('async');

router.all('/', function(req, res, next) {
  var ticketUser;

  models.users.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    ticketUser = user;

    if (ticketUser) {
      models.course_requests.findOne({
        where: {
          user_id: ticketUser.id,
          status: 'requested'
        }
      }).then(function (courseRequest) {
        if (courseRequest) {
          res.json({
            result: 2,
            courseRequest: courseRequest
          });
        } else {
          models.tickets.findAll({
            include: [{
              model: models.courses,
              include: [{
                model: models.events,
                include: [{
                  model: models.starting_points
                }]
              },{
                model: models.course_details
              }]
            },{
              model: models.destinations
            },{
              model: models.users,
              attributes: ['phone']
            }],
            where: {
              user_id: ticketUser.id
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
  var busCount = 0;
  var minMembersMinus = 0;

  async.forever(
    function (next) {
      var minSetFlag = true;

      models.courses.findAll({
        where: {
          event_id: req.body.eid
        },
        order: [
          ['req_members', 'DESC']
        ]
      }).then(function (courses) {

        async.each(courses, function (course, cb) {
          var courseOfEvent = course;

          models.course_requests.sum('members', {
            where: {
              course_id: courseOfEvent.id,
              status: 'requested'
            }
          }).then(function (sum) {
            if (busCount < 5 && sum >= courseOfEvent.min_members - minMembersMinus) {
              models.course_requests.findAll({
                include: [{
                  model: models.users,
                  include: [{
                    model: models.devices
                  }]
                }],
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

                    ticket.save().then(function () {
                      models.push_messages.findOne({
                        include: [{all: true}],
                        where: {
                          scheme: '1'
                        }
                      }).then(function (pushMessage) {
                        //utils.sendPush(pushMessage, courseRequest.user.devices);
                      });
                    });

                    courseRequest.update({
                      status: 'ticketed'
                    }, {fields: ['status']}).then(function () {

                    });

                    sumMembers += courseRequest.members;
                  }
                });

                busCount++;
                minSetFlag = false;

                cb();
              });
            }
          });
        }, function(err) {
          if (err) {
            console.log(err);
          } else {
            if (minSetFlag) {
              minMembersMinus += 1;
            }

            console.log("fff");
          }
        });

        if(busCount < 5 && minMembersMinus < 2) {
          next();
        } else {
          console.log(busCount);
          console.log(minMembersMinus);
          next('end');
        }
      });
    },
    function (err) {
      console.log(err);

      models.course_requests.findAll({
        include: [{
          model: models.users,
          include: [{
            model: models.devices
          }]
        }],
        where: {
          status: 'requested'
        },
        order: [
          ['udate', 'ASC']
        ]
      }).then(function (courseRequests) {
        async.each(courseRequests, function (courseRequest) {
          courseRequest.update({
            status: 'rejected'
          }, {fields: ['status']}).then(function() {
            models.push_messages.findOne({
              include: [{ all: true }],
              where : {
                scheme: '2'
              }
            }).then(function(pushMessage) {
              //utils.sendPush(pushMessage, courseRequest.user.devices);
            });
          });
        });
      });

      console.log("-------------------------------");
      console.log(busCount);
      console.log(minMembersMinus);
      console.log("-------------------------------");

      models.events.findOne({
        where: {
          id: req.body.eid
        }
      }).then(function(event) {
        event.update({
          status: "end"
        }, {fields: ['status']}).then(function() {

        });
      });
    }
  );

  //return res.json({
  //  result: 1
  //});
});

module.exports = router;