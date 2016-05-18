var models = require('../../models');
var express = require('express');
var router = express.Router();

router.all('/request', function(req, res, next) {
  var courseRequest = models.course_requests.build({
    event_id: req.query.event_id,
    destination_id: req.query.destination_id,
    user_id: req.query.userId
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

module.exports = router;