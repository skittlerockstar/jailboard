
module.exports = function(RED) {
    var request = require('request');
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            request.post({url:'http://localhost:3000/api/jailboard/red/test', form: {key:'value'}}, function (error, response, body) {
               
                    console.log(response.body);
               
              });
            node.send(msg);
        });
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}
