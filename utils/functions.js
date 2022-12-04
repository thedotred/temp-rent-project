const request = require('request'),
Stream = require('stream').Transform,
path = require('path'),
fs = require('fs');

const url = 'http://www.google.com/images/srpr/logo11w.png',
download_path = path.join(__dirname, 'public/uploads/productImages');   

request(url, function(response) {                                        
    var data = new Stream();                                                    
  
    response.on('data', function(chunk) {                                       
      data.push(chunk);                                                         
    });                                                                         
  
    response.on('end', function() {                                             
      fs.writeFileSync(`${download_path}${Date.now}-image.png`, data.read());                               
    });                                                                         
});
