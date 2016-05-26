var models = require('../../models');
var utils = require('../../utils');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var async = require('async');
var Q = require('q');

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
  var busCount = req.body.bcnt || 0;
  var minMembersMinus = req.body.mmembers || 0;

  models.courses.findAll({
    where: {
      event_id: req.body.eid
    }
  }).then(function (courses) {

    var asyncJob = function(course, a) {
      var deferred = Q.defer();
      setTimeout(function() {

        var courseOfEvent = course;

        models.course_requests.sum('members', { where: { course_id: courseOfEvent.id, status: 'requested' }}).then(function(sum) {
          if(busCount > 0 && sum >= courseOfEvent.min_members - minMembersMinus) {
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

                  ticket.save().then(function() {
                    models.push_messages.findOne({
                      include: [{ all: true }],
                      where : {
                        scheme: '1'
                      }
                    }).then(function(pushMessage) {
                      utils.sendPush(pushMessage, courseRequest.user.devices);
                    });
                  });

                  courseRequest.update({
                    status: 'ticketed'
                  }, {fields: ['status']}).then(function() {

                  });

                  sumMembers += courseRequest.members;
                }
              }, function() {
                cb();
              });

            });

            busCount--;
            console.log(busCount);

          }
        });

        deferred.resolve(1);
      }, 300);

      return deferred.promise;
    };

    function next(idx) {
      if (idx > courses.length -1) { return Q(true); }
      return asyncJob(courses[idx]).then(function(result) {
        return next(idx+ 1);
      });
    }

    next(0).then(function() {
      console.log('completed');
      console.log(req.body.bcnt - busCount);

      res.json({
        result: 1,
        busCount: req.body.bcnt - busCount
      });
    });
  });
});

router.all('/reject', function(req, res, next) {
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
          utils.sendPush(pushMessage, courseRequest.user.devices);
        });
      });
    }, function () {
      res.redirect('/ticket');
    });
  });
});

router.all('/end', function(req, res, next) {
  models.events.findOne({
    where: {
      id: req.body.eid
    }
  }).then(function(event) {
    event.update({
      status: "end"
    }, {fields: ['status']}).then(function() {
      res.redirect('/ticket');
    });
  });
});


module.exports = router;