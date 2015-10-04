var iot_http = require('../src/iot_http.js');
var client_params = {
	hostname: 'g.us-east-1.pb.iot.amazonaws.com',
	version: 'beta'
}

iot_http_client = new iot_http(client_params);

message = 'Hello world!'

iot_http_client.publish('a', message);