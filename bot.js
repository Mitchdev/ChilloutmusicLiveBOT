const Discord = require('discord.js');
const firebase = require('firebase-admin');
const client = new Discord.Client();
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
    primary.firestore().collection('options').doc('settings').onSnapshot(doc => {
      if (doc.data().song.id !== currentSong.id) {
        client.user.setPresence({game:{name:doc.data().song.artist+' - '+doc.data().song.title},status:'dnd'}).then(console.log).catch(console.error);
      }
      if (doc.data().song.skip == 'true') {
        log(doc.data().skippedBy+" skipped the current song","["+currentSong.artist+" - "+currentSong.title+"](https://youtu.be/"+currentSong.id+")",{
          "name":"Now Playing",
          "value":"["+doc.data().song.artist+" - "+doc.data().song.title+"](https://youtu.be/"+doc.data().song.id+")"
        });
      }
      currentSong.id = doc.data().song.id;
      currentSong.artist = doc.data().song.artist;
      currentSong.title = doc.data().song.title;
    }, error => {
      console.log(error);
    });
});

client.on('message', message => {
  console.log(message.content);
});

function log(title, description, fields) {
  client.channels.get('438921855965855745').sendEmbed({
    "embed": {
      "color": 3381181,
      "timestamp": new Date(),
      "title": title,
      "description": description,
      "fields": fields
    }
  });
}

client.login(process.env.BOT_TOKEN);
