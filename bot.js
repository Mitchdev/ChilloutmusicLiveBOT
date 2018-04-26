const Discord = require('discord.js');
const firebase = require('firebase-admin');
const serviceAccount = require('https://mitchdev.net/m/admin/dashboard/mdhomepage-74632-firebase-adminsdk-ynfwk-317d08f61d.json');
const client = new Discord.Client();
firebase.initializeApp(serviceAccount);
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
