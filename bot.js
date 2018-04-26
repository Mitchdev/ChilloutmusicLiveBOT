const Discord = require('discord.js');
const firebase = require('firebase-admin');
const primary = firebase.initializeApp({
  apiKey: process.env.FIREBASE_KEY1,
  authDomain: "chilloutmusiclive-a8271.firebaseapp.com",
  databaseURL: "https://chilloutmusiclive-a8271.firebaseio.com",
  projectId: "chilloutmusiclive-a8271",
  storageBucket: "chilloutmusiclive-a8271.appspot.com",
  messagingSenderId: "732098226532"
}, 'primary');
const secondary = firebase.initializeApp({
  apiKey: process.env.FIREBASE_KEY2,
  authDomain: "chilloutmusiclive-a8271.firebaseapp.com",
  databaseURL: "https://chilloutmusiclive-a8271.firebaseio.com",
  projectId: "chilloutmusiclive-a8271",
  storageBucket: "chilloutmusiclive-a8271.appspot.com",
  messagingSenderId: "1020325985374"
}, 'secondary');
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Bot online!`);
    primary.firestore().collection('options').doc('settings').get().then(doc => {
      if (doc.exists) {
        console.log('Document data:', doc.data().song);
      } else {
        console.log('No such document!');
      }
    }).catch(err => {
      console.log('Error getting document', err);
    });
    client.user.setPresence({game: { name: 'Jon Kuwada - Cherry Cola' }, status: 'idle' }).then(console.log).catch(console.error);
});

client.on('message', message => {
    if (message.content == '!ping') {
    	message.reply('pong!');
  	}
});

client.login(process.env.BOT_TOKEN);
