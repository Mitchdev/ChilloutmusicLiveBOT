const Discord = require('discord.js');
const firebase = require('firebase-admin');
const client = new Discord.Client();
firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'mdhomepage-74632',
    clientEmail: 'firebase-adminsdk-ynfwk@mdhomepage-74632.iam.gserviceaccount.com',
    privateKey: JSON.parse(process.env.SERVICE_KEY)
  }),
  databaseURL: 'https://mdhomepage-74632.firebaseio.com'
});
client.on('ready', () => {
    firebase.firestore().collection('options').doc('settings').get().then(doc => {
      if (doc.exists) {console.log('Document data:', doc.data().song);} else {console.log('No such document!');}
    }).catch(err => {console.log('Error getting document', err);});
    client.user.setPresence({game: { name: 'Jon Kuwada - Cherry Cola' }, status: 'idle' }).then(console.log).catch(console.error);
});

client.on('message', message => {
  console.log(message.content);
});

client.login(process.env.BOT_TOKEN);
