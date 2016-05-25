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
    res.render('ticket', {courseRequests: courseRequests, busCount: req.query.busCount});
  });
});

router.post('/ticket', function(req, res, next) {
  var request = require('request');
  var url = 'http://localhost:3000/api/tickets/ticketing';

  request.post(url, {json: true, body: req.body}, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      return res.redirect('/ticket?busCount', + response.busCount);
    } else {
      return res.redirect('/ticket');
    }
  });
});

router.get('/test', function(req, res, next) {
  var arr = [1, 2, 3];

  async.each(arr, function(num, callback) {
    console.log('num : ' + num);

    console.log('File processed');
    callback();
  }, function(err){
    if( err ) {
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
      res.render('error');
    }
  });
});

module.exports = router;
