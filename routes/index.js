var models = require('../models');
var express = require('express');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/push', function(req, res, next) {
  var messages;

  models.push_messages.findAll({
    include: [{ all: true }]
  }).then(function (pushMessages) {
    messages = pushMessages;

    models.courses.findAll({

    }).then(function (courses) {
      res.render('push-send', {pushMessages: messages, courses: courses});
    });
  });
});

router.get('/ticket', function(req, res, next) {
  models.course_requests.findAll({
    include: [{ all: true }],
    where: {
      status: 'requested'
    }
  }).then(function (courseRequests) {
    res.render('ticket', {courseRequests: courseRequests});
  });
});

module.exports = router;
