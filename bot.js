const Discord = require('discord.js');
const firebase = require('firebase-admin');
const client = new Discord.Client();
const currentSong = {artist:'undefined',title:'undefined'}
firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'mdhomepage-74632',
    clientEmail: 'firebase-adminsdk-ynfwk@mdhomepage-74632.iam.gserviceaccount.com',
    privateKey: JSON.parse(process.env.SERVICE_KEY)
  }),
  databaseURL: 'https://mdhomepage-74632.firebaseio.com'
});
client.on('ready', () => {
    firebase.firestore().collection('options').doc('settings').onSnapshot(doc => {
      console.log(doc.data().song);
      
    }, error => {
      console.log(error);
    });
});

client.on('message', message => {
  console.log(message.content);
});

client.login(process.env.BOT_TOKEN);
