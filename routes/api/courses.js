var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/request', function(req, res, next) {
  var requestUser;
  var requestCourses;

  if (req.body.members > 4) {
    res.json({
      result: 0,
      err: 'The number of members is too large.'
    });
  }

  models.users.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    requestUser = user;

    models.courses.findAll({
      where: {
        event_id: req.body.event_id
      }
    }).then(function (courses) {
      requestCourses = courses;

      models.course_details.findAll({
        where: {
          destination_id: req.body.destination_id
        }
      }).then(function (courseDetails) {
        var courseId = 0;

        for (var i = 0; i < requestCourses.length; i++) {
          for (var j = 0; j < courseDetails.length; j++) {
            console.log("detail: " + courseDetails[j].course_id);
            if (requestCourses[i].id === courseDetails[j].course_id) {
              courseId = requestCourses[i].id;
              break;
            }
          }
          console.log("course: " + requestCourses[i].id);
        }

        var courseRequest = models.course_requests.build({
          course_id: courseId,
          destination_id: req.body.destination_id,
          user_id: requestUser.id
        });

        courseRequest.save().then(function() {
          res.json({
            result: 1
          });
        }).catch(function() {
          res.json({
            result: 0
          });
        });
      });
    });
  }).catch(function() {
    res.json({
      result: 0
    });
  });
});

module.exports = router;