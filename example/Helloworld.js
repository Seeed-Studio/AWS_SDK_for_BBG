var aws_iot = require("../src/aws_iot.js");

var client_params = {
	host: 'mqtts://g.us-east-1.pb.iot.amazonaws.com',
	clientId: 'sdk_test',
	key: '/var/lib/cloud9/IotSdkJS/prodCerts/device_key.pem',
    cert: '/var/lib/cloud9/IotSdkJS/prodCerts/device_identity.pem',
    ca: '/var/lib/cloud9/IotSdkJS/prodCerts/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem'
};
var mes;
var iot_client = new aws_iot(client_params);
iot_client.connect();
iot_client.subscribe('test');

iot_client.onMessage(function(topic, message){
	mes = message.toString();
	console.log(mes);
});

iot_client.publish('test', 'Hello world');