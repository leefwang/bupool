

router.all('/push', function(req, res, next) {
  var gcm = require('node-gcm');
  var fs = require('fs');

  var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      title: 'saltfactory GCM demo',
      message: 'Google Cloud Messaging 테스트'
    }
  });

  var server_api_key = 'AIzaSyCU71ywHf21rf1QXGjcaBzKO5TKKNr96fw';
  var sender = new gcm.Sender(server_api_key);
  var registrationIds = [];

  var token = 'cl_Mt8IHU9U:APA91bE9fCOc8tXNbiur1Nqe5lbzUNglkfkHsae8bJylBxCGE8pDGbXp6tl8x_fQfvX7VyjXnwc2FPdlVqqWXG8bWBOUy89IyoXsGqE2BL_kuv2lEZ8wPg_joGxKxh5Xak3UtZHt_sHo';
  registrationIds.push(token);

  sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
  });
});

module.exports = router;