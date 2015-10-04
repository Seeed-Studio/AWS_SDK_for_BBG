var aws_iot = require("../src/aws_iot.js");
var b = require('bonescript');
var client_params = {
    host: 'mqtts://g.us-east-1.pb.iot.amazonaws.com',
	clientId: 'sdk_sub2',
    key: '/var/lib/cloud9/IotSdkJS/prodCerts/device_key.pem',
    cert: '/var/lib/cloud9/IotSdkJS/prodCerts/device_identity.pem',
    ca: '/var/lib/cloud9/IotSdkJS/prodCerts/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem'
};

b.pinMode('P9_11', b.OUTPUT);
iot_client = new aws_iot(client_params);
iot_client.connect();
iot_client.subscribe('topic/b');
iot_client.onMessage(function(topic, message){
    if(message.toString() === 'HIGH'){
        b.digitalWrite('P9_11', b.HIGH);
        console.log('LED is on');
    }
    else{ 
        b.digitalWrite('P9_11', b.LOW);
        console.log('LED is off');
	}
});
