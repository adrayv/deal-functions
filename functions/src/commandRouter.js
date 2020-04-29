const functions = require('firebase-functions');
const admin = require('firebase-admin');

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
        const newState = gameState;
        // reducer(gameState, { type, payload });
        console.log('NEW STATE', newState, type, payload);
      } else {
        console.log('SNAP', snap.data());
      }
    } catch (err) {
      console.error('ERROR RUNNING COMMAND', err);
    }
    return;
  });
