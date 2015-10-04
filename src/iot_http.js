var https = require('https');
var tls = require('tls');
var fs = require('fs');

//check whether user does not input client_params
function checkParams(a, default1){
   return typeof a !== 'undefined' ? a : default1; 
};

function isValid(h){
  if(typeof h !== 'undefined'){
    return true;
  }
};

function iot_http(client_params){
  this.client_params = client_params;
  if(!isValid(client_params.hostname)){
    throw 'Error! Please input host';
  }
  if(!isValid(client_params.version)){
    throw 'Error! Please input version';
  }
//check whether the certificates are in the folder
  try{
    this.client_params.key = fs.readFileSync(checkParams(client_params.key, '../prodCerts/device_key.pem'));
  }catch(e){
    if(e.code === 'ENOENT'){
      console.log("Key is not found");
    }
    else{
      throw e;
    }
  }

  try{
    this.client_params.cert = fs.readFileSync(checkParams(client_params.cert, '../prodCerts/device_identity.pem'));
  }catch(e){
    if(e.code === 'ENOENT'){
      console.log("Cert is  not found");
    }
    else{
      throw e;
    }
  }

  try{
    this.client_params.ca = fs.readFileSync(checkParams(client_params.ca, '../prodCerts/VeriSign-Class\ 3-Public-Primary-Certification-Authority-G5.pem'));
  }catch(e){
    if(e.code === 'ENOENT'){
      console.log("Ca is  not found");
    }
    else{
      throw e;
    }
  }

  this.client_params.port = checkParams(client_params.port, 8192);

  this.publish = function(topic, message){
    var publish_params = {};
    publish_params.hostname = client_params.hostname;
    publish_params.port = client_params.port;
    publish_params.key = client_params.key;
    publish_params.cert = client_params.cert;
    publish_params.ca = client_params.ca;
    publish_params.requestCert = true;
    publish_params.rejectUnauthorized = false;
    publish_params.method = 'post';
    publish_params.path = '/' + client_params.version + '/' + 'topics' + '/' + topic;
    publish_params.headers = {
      'Content-Type': 'text/plain',
      'Content-Length': message.length
    };
    var req = https.request(publish_params, function(res){
      console.log('Status: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      console.log('Publishes: ' + message);
      res.setEncoding('utf8');
      res.on('data', function(chunk){
        console.log('Body: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(message);
    req.end();
  };

}

module.exports = iot_http;