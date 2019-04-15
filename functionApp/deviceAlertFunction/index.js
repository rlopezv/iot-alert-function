var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var connectionString = process.env.AzureIoTHubConnectionString;

const MAX_TEMPERATURE = 20;

module.exports = async function(context, mySbMsg) {
    context.log("Received raw message from device " + JSON.stringify(mySbMsg));
    var jsonMessage = mySbMsg;
    context.log("After parsing message, reading :");
    context.log("    deviceId : " + jsonMessage.deviceId);

    var client = Client.fromConnectionString(connectionString);
    if (jsonMessage.temperature && jsonMessage.temperature>MAX_TEMPERATURE) {
        client.open(function (err) {
            if (err) {
              context.log('Could not connect: ' + err.message);
            } else {
              context.log('Client connected');
          
              // Create a message and send it to the device
              var data = JSON.stringify(jsonMessage.temperature);
              var message = new Message(data);
              client.send(jsonMessage.deviceId, message, printResultFor('send', context));
            }
            context.done();
          });
    } else {
        context.done();
    }

};

// Helper function to print results in the console
function printResultFor(op, context) {
    return function printResult(err, res) {
      if (err) {
        context.log(op + ' error: ' + err.toString());
      } else {
        context.log(op + ' status: ' + res.constructor.name);
      }
    };
  }