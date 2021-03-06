const Discord = require('discord.js');
const firebase = require('firebase-admin');
const client = new Discord.Client();
var waiting = false;
var firstUpdate = true;
var evalChannel = '438921855965855745';
var currentSong = {
  id: 'undefined',
  artist: 'undefined',
  title: 'undefined',
}
var primary = firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'mdhomepage-74632',
    clientEmail: 'firebase-adminsdk-ynfwk@mdhomepage-74632.iam.gserviceaccount.com',
    privateKey: JSON.parse(process.env.SERVICE_KEY)
  }),
  databaseURL: 'https://mdhomepage-74632.firebaseio.com'
}, 'primary');
var secondary = firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'chilloutmusiclive-a8271',
    clientEmail: 'firebase-adminsdk-r1j5c@chilloutmusiclive-a8271.iam.gserviceaccount.com',
    privateKey: JSON.parse(process.env.SERVICE_KEY2)
  }),
  databaseURL: 'https://chilloutmusiclive-a8271.firebaseio.com'
}, 'secondary');
client.on('ready', () => {
    secondary.firestore().collection('logs').doc('0').onSnapshot(doc => {
      if (firstUpdate) {firstUpdate = false} else {log(doc.data().title, doc.data().description, doc.data().color, doc.data().fields)}
    }, error => {console.log(error)});
    primary.firestore().collection('options').doc('settings').onSnapshot(doc => {
      if (doc.data().song.id == 'undefined') {currentSong = doc.data().song}
      if (waiting) {
        waiting = false;
        log(doc.data().song.skippedBy+" skipped the current song","["+currentSong.artist+" - "+currentSong.title+"](https://youtu.be/"+currentSong.id+")",3381181,null);
      }
      if (currentSong.id !== doc.data().song.id) {
        client.user.setPresence({game:{name:'Maintenance'},status:'dnd'}).catch(console.error);
        //client.user.setPresence({game:{name:doc.data().song.artist+' - '+doc.data().song.title},status:'online'}).catch(console.error);
        //log("Now Playing","["+doc.data().song.artist+" - "+doc.data().song.title+"](https://youtu.be/"+doc.data().song.id+")",3381181,null);
      }
      if (doc.data().song.skip == 'true') {waiting = true}
      currentSong = doc.data().song;
    }, error => {console.log(error)});
});
client.on('message', message => {
  if (message.content.startsWith('!eval') && message.author.id == '399186129288560651') {
    evalChannel = message.channel.id;
    try {
      let evaled = eval(message.content.split(" ").slice(1).join(" "));
      if (typeof evaled != "string") {evaled = require("util").inspect(evaled)}
      message.channel.send(clean(evaled), {code: "xl", split: true})
    } catch(error) {message.channel.send(clean(error), {code: "xl", split: true})}
  }
  if (message.content.startsWith('!setpassword') && message.channel.type == 'dm') {
    const args = message.content.split(' ');
    if (args && args.length == 3) {
      if (args[1] == args[2]) {
        if (args[1].length > 6) {
          primary.firestore().collection('users').doc(message.author.id).get().then(function(doc) {
            if (doc.exists) {
              primary.auth().updateUser(doc.data().uid, {password: args[1]}).then(function() {
                primary.firestore().collection('users').doc(doc.data().uid).set(doc.data()).then(function() {
                  primary.firestore().collection('users').doc(message.author.id).delete().then(function() {
                    message.reply('Successfully set password for your account to '+args[1]+'\nYou are now able to login: https://mitchdev.net/m/admin/dashboard/login');
                  }).catch(function(error) {message.reply(error.message).then(msg => msg.delete(5000))});
                }).catch(function(error) {message.reply(error.message).then(msg => msg.delete(5000))});
              }).catch(function(error) {message.reply(error.message).then(msg => msg.delete(5000))});
            } else {message.reply('Incorrect user identification').then(msg => msg.delete(5000))}
          }).catch(function(error) {message.reply(error.message).then(msg => msg.delete(5000))});
        } else {message.reply('Password must be at least 6 characters long').then(msg => msg.delete(5000))}
      } else {message.reply('Please use correct format: `!setpassword <password> <confirm-password>`').then(msg => msg.delete(5000))}
    } else {message.reply('Passwords do not match').then(msg => msg.delete(5000))}
  }
  if (message.content.startsWith('!makeuser') && message.author.id == '399186129288560651') {
    const args = message.content.split(' ');
    if (args && args.length == 4 && message.mentions.users.size > 0) {
      primary.auth().createUser({
        email: args[1],
        emailVerified: true,
        password: "password",
        displayName: args[2]
      }).then(function(user) {
          primary.firestore().collection('users').doc(message.mentions.users.first().id).set({
            disabled: false,
            admin: false,
            email: user.email,
            uid: user.uid,
            discord: message.mentions.users.first().id,
            username: user.displayName
          }).then(function() {
            message.mentions.users.first().send('Please set a password for your account '+user.displayName+' ('+user.email+')\n`!setpassword <password> <confirm-password>`');
            message.reply('Successfully created the user '+user.displayName).then(msg => msg.delete(5000));
          }).catch(function(error) {message.reply(error.message).then(msg => msg.delete(5000))});
      }).catch(function(error) {message.reply(error.message).then(msg => msg.delete(5000))});
    } else {message.reply('Please use correct format: `!makeuser <email> <username> <@discordUsername>`').then(msg => msg.delete(5000))}
    message.delete(5000);
  }
});
const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
function log(title, description, color, fields) {
  var embed = new Discord.RichEmbed({
    "color": color,
    "timestamp": new Date(),
    "title": title,
    "description": description,
    "fields": fields
  });
  client.channels.get('438921855965855745').send(embed).catch(error => {console.log(error)});
}
client.login(process.env.BOT_TOKEN);
process.on('unhandledRejection', err => client.channels.get(evalChannel).send(clean(err.stack), {code: "xl", split: true}));
