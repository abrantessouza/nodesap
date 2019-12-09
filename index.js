const express = require('express');
const app = express();
var http = require('http')
var soap = require('strong-soap').soap;
const SapKeys = require('./sapkeys')

let WSDL = soap.WSDL

let url = 'http://vhcalnplci:8000/sap/bc/srt/wsdl/flv_10002A101AD1/bndg_url/sap/bc/srt/rfc/sap/z_abrantes_services/001/zabrantesservices/abrantesservices?sap-client=001'

let keys = new SapKeys().vals()

const auth = 'Basic ' + Buffer.from(`${keys.user}:${keys.pass}`).toString('base64')
const options = {       
  wsdl_headers: {
    'Authorization': auth
  }
}

app.get('/', function (req, res) {
    WSDL.open(url,options,
        function(err, wsdl) {
         
          let requestArgs = {}
          var clientOptions = {
            WSDL_CACHE : {
              abranteswsdl: wsdl
            }
          };
          soap.createClient('abranteswsdl', clientOptions, function(err, client) {
              client.setSecurity(new soap.BasicAuthSecurity(keys.user,keys.pass))
            var method = client['ZRemotListsample']
            method(requestArgs, function(err, result, envelope, soapHeader) {     
        
            console.log('Response Envelope: \n' + soapHeader);
            res.send( JSON.stringify(result));
           
          });
        });
      });
   
});


http.createServer(app).listen(8089)