var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/push', function(req, res, next) {
  models.push_messages.findAll({
    include: [{ all: true }]
  }).then(function (pushMessages) {
    res.render('push-send', {pushMessages: pushMessages});
  });
});

module.exports = router;
