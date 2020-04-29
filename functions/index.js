const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.create = require('./src/createGame');

/* test function */
exports.myFunction = functions.firestore
  .document('commands/{commandId}')
  .onCreate((snap, context) => {
    const { commandId } = context.params;
    const db = admin.firestore();
    return db.collection('games').doc().create({ status: 'LOBBY', commandId });
  });
