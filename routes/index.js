var models = require('../models');
var express = require('express');
var router = express.Router();

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

router.post('/ticket', function(req, res, next) {
  var request = require('request');
  var url = 'http://localhost:3000/api/tickets/ticketing';

  request.post(url, {json: true, body: req.body}, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      return res.redirect('/ticket');
    } else {
      return res.redirect('/ticket');
    }
  });
});

module.exports = router;
