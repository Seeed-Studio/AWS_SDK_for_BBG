var aws_iot = require("../src/aws_iot.js");
var client_params = {
	host: 'mqtts://g.us-east-1.pb.iot.amazonaws.com',
	clientId: 'sdk_sub2'
};

var iot_client = new aws_iot(client_params);
iot_client.connect();
iot_client.subscribe(['topic/a', 'topic/b']);

iot_client.subscribe('topic/b');
iot_client.onMessage(function(topic, message){
	console.log(topic.toString() + ' '+ message.toString());
});