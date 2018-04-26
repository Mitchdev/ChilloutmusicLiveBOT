const Discord = require('discord.js');
const firebase = require('firebase-admin');
const client = new Discord.Client();
var currentSongTitle = 'undefined';
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
      if (doc.data().song.title !== currentSongTitle) {
        currentSongTitle = doc.data().song.title;
        client.user.setPresence({game:{name:doc.data().song.artist+' - '+doc.data().song.title},status:'dnd'}).then(console.log).catch(console.error);
      }
    }, error => {
      console.log(error);
    });
});

client.on('message', message => {
  console.log(message.content);
});

client.login(process.env.BOT_TOKEN);
