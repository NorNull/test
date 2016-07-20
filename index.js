var express = require ('express');
var app = express ();
var server = require ('http').createServer (app);
var io = require ('socket.io').listen (server);

app.set ('port', process.env.PORT || 3000, function(){
   var host = server.address().address;
   var port = server.address().port;
   console.log('Listening on http://%s:%s', host, port);
});

app.get ('/', getRoot);

function getRoot (req, res) {
  res.send ("Server is running : " + server.address ().address + server.address ().port);
}
server.listen (app.get ('port'), function () {
  console.log ("Server is running" + server.address ().port)
});

var user = [,];

io.on('connection', function (socket) {

  var result = {code:200, message:"net active"};

  socket.emit ("net_active", result);

  socket.on ('connect', function (r_data) {

    user [r_data ['user'], 'socket_id'] = socket.id;
    user [r_data ['user'], 'pos'] = r_data ['pos'];

    socket.broadcast.emit ('connect', r_data);
    user.forEach(function (index) {
        var data = {user : user [index] ['socket_id'], position : user [index] ['position']}

        socket.emit ('connect', data);
    });
  });

  socket.on('movement', function (r_data) {
    user [r_data ['user'], 'pos'] = r_data ['pos'];

    socket.broadcast.emit ('movement', r_data);
  });

  socket.on('logout', function (r_data) {
    socket.broadcast.emit ('logout', r_data);
  });
});
