const Discord = require('discord.js');
const firebase = require('firebase-admin');
const client = new Discord.Client();
var waiting = false;
var firstUpdate = true;
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
        log("Now Playing","["+doc.data().song.artist+" - "+doc.data().song.title+"](https://youtu.be/"+doc.data().song.id+")",3381181,null);
      }
      if (doc.data().song.skip == 'true') {waiting = true}
      client.user.setPresence({game:{name:doc.data().song.artist+' - '+doc.data().song.title},status:'online'}).then(console.log).catch(console.error);
      currentSong = doc.data().song;
    }, error => {console.log(error)});
});
client.on('message', message => {console.log(message.content)});
function log(title, description, color, fields) {
  var embed = new Discord.RichEmbed({
    "color": color,
    "timestamp": new Date(),
    "title": title,
    "description": description,
    "fields": fields
  });
  client.channels.get('438921855965855745').sendEmbed(embed).catch(error => {console.log(error)});
}
client.login(process.env.BOT_TOKEN);
