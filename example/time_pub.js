var aws_iot = require("../src/aws_iot.js");
var client_params = {
	host: 'mqtts://g.us-east-1.pb.iot.amazonaws.com',
	clientId: 'sdk_pub2'
};


iot_client = new aws_iot(client_params);
iot_client.connect();
setInterval(function(){
	iot_client.publish('topic/a','current time is ' + new Date());
}, 2000);