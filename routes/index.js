module.exports = function Route(app){
  app.get('/', function(req, res){
    res.render('index', {title: 'Group Chat', session_id: req.sessionID});
  });

  users = [];
  messages = [];

  app.io.route('new_user', function(req){

    var USER = function(name) {
      this.name = name;
      this.id = undefined;
    }

    user = new USER(req.data.name);

    user.id = req.sessionID;

    users.push(user);

    req.io.broadcast('show_new_user', user);

    req.io.emit('existing_users', users);

    req.io.emit('existing_messages', messages);

  })

  app.io.route('new_message', function(req){

    content = req.data.message;
    name = req.data.name;
    message = {message: content, name: name};
    messages.push(message);

    app.io.broadcast('updated_message', message);
  })

  app.io.route('disconnect', function(req){
    for(var i=0; i < users.length; i++ )
    {
      if(users[i].id === req.sessionID)
      {
        name = users[i].name;
        users.splice(i, 1);
      }
    }

    disconnected_user = {id: req.sessionID, name: name}
    // console.log('##########Disconnected#########', req);
    req.io.broadcast('disconnect_user', disconnected_user )
  });


}
