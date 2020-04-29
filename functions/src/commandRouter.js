const functions = require('firebase-functions');
const admin = require('firebase-admin');
const actionCreator = require('./game/actionCreator');
const { reducer } = require('./game/core');

module.exports = functions.firestore
  .document('commands/{commandId}')
  .onCreate(async snap => {
    try {
      const { gameId, type, payload } = snap.data();
      if (gameId) {
        const db = admin.firestore();
        const gameState = (
          await db.collection('games').doc(gameId).get()
        ).data();
        const newState = reducer(gameState, actionCreator(type, payload));
        await db.collection('games').doc(gameId).set(newState);
      } else {
        console.log('SNAP', snap.data());
      }
    } catch (err) {
      console.error('ERROR RUNNING COMMAND', err);
    }
    return;
  });
