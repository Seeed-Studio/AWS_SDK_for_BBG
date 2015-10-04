var mqtt    = require('mqtt');
var tls = require('tls');
var fs = require('fs');

//check whether user does not input client_params
function checkParams(a, default1){
   return typeof a !== 'undefined' ? a : default1; 
};

//error if host is not specified by the user
function isValid(h){
  if(typeof h !== 'undefined'){
    return true;
  }
};

const PUBLISH_PARAMS = {
  qos : 0,
  retain: false
};

const SUBSCRIBE_PARAMS = {
  qos : 0
};

function aws_iot(client_params){
  this.client_params = client_params;
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

  this.client_params.port = checkParams(client_params.port, 443);
  this.client_params.requestCert = true;
  this.client_params.rejectUnauthorized = false;
  var client;

  this.connect = function(){
    //clientID and host are must be put by the user, if not , shows error
    if(!isValid(client_params.host) && !isValid(client_params.clientId)){
      throw "Error! Please input host and clientId";

    }
    else if(!isValid(client_params.host)){
      throw 'Error! Please input host';
    }
    else if(!isValid(client_params.clientId)){
      throw "Error! please input clientId";
    }
    else {
      client  = mqtt.connect(client_params.host, client_params);
      client.on('connect', function() {
      console.log("Connected to " + client_params.host);
                }
        );
      client.on('error', function(err) {
        console.log('error!', err);
        });
    }
  };

  this.getClient = function(){
    return client;
  };

  this.publish = function(topic, message, p_params) {
    if(topic === undefined && message == undefined){
      throw "Specify the arguments in publish(). Topic and message are must."
    }
    if(client === undefined){
      throw "You should connect to the host by calling connect() before publishing!";
    }
    else{
      if(typeof p_params === 'undefined'){
        p_params = PUBLISH_PARAMS;
      }
      client.publish(topic, message, p_params, function(){
        console.log("successfully publishes: " + message.toString());
      });
    }  
  };

  this.subscribe = function(topic, s_params){
    if(topic === undefined && s_params == undefined){
      throw "Specify the arguments in subscribe(). Topic is must."
    }
    if(client === undefined){
      throw "You should connect to the host by calling connect() before subscribing!";
    }
    else{
      if(s_params === undefined){
        s_params = SUBSCRIBE_PARAMS;
      } 
      else if(s_params.qos > 2){
        throw "qos can not be bigger than 2";
      }
      client.subscribe(topic, s_params, function(){
        console.log("successfully sending subscribe");
      });
    }
  };

  this.onMessage = function(callback){
    if(typeof callback !== 'undefined'){
      client.on('message', callback);
    }
    else{
      throw "argument should be a function which takes topic and message as its arguments";
    }
  };

  this.disconnect = function(){
    if(client !== undefined){
      client.end();
    }
  };
}

module.exports = aws_iot;
