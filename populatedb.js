#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var User = require('./models/user');
var Message = require('./models/message');
const { DateTime } = require("luxon");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var messages = [];

function userCreate(name, pwd, privilege, cb) {
    
  var user = new User({name, pwd, privilege});
       
  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}

function messageCreate(title, userID, text, cb){
  var now = DateTime.local()
  var message = new Message({title, timestamp:now, user:userID, text});
  message.save(function(err){
    if(err) {
      cb(err, null);
      return;
    }
    console.log("New message: " + message)
    messages.push(message);
    cb(null, message);
  })
}

function createUsers(cb) {
    async.series([
      function(callback) {
        userCreate('Admin', 'password2', 2, callback);
		},
		function(callback) {
			userCreate('RegUser', 'password0', 0, callback);
		},        
		function(callback) {
			userCreate('MemUser', 'password1', 1, callback);
		},        
        ],
        // optional callback
        cb);
}

function createMessages(cb) {
  async.series([
    function(callback) {
      messageCreate('TestAd', '600ad66e6ff6ba74c2818b7a', "The quick brown fox jumps over the lazy admin.", callback);
    },
  function(callback) {
    messageCreate('TestReg', '600ad66f6ff6ba74c2818b7b', "The quick brown fox jumps over the lazy RegUser.", callback);
    },        
  function(callback) {
    messageCreate('TestMem', '600ad66f6ff6ba74c2818b7c', "The quick brown fox jumps over the lazy MemUser.", callback);
    },        
  ],
  // optional callback
  cb);
}

async.series([
    createUsers,
    createMessages    
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Users: '+ users);
        console.log('Messages: '+ messages);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




