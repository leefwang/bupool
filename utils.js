var gcm = require('node-gcm');
var fs = require('fs');

exports.sendPush = function (push, devices) {
  var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      title: push.title,
      message: push.message
    }
  });

  var server_api_key = 'AIzaSyCU71ywHf21rf1QXGjcaBzKO5TKKNr96fw';
  var sender = new gcm.Sender(server_api_key);
  var registrationIds = [];

  for (var i = 0; i < devices.length; i++) {
    registrationIds.push(devices[i].token);
  }

  sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
  });
};