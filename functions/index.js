const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { createInitialGameState } = require('./src');

exports.create = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const { player } = req.query;
    if (!player) {
      throw new Error(
        'attach the name of the initial player as a query parameter i.e. ?player=john'
      );
    }
    const docRef = await db
      .collection('games')
      .add(createInitialGameState(player));
    res.status(200).send({ gameId: docRef.id });
  } catch (error) {
    console.error('ERROR CREATING GAME', error);
    res.status(400).send(JSON.stringify(error));
  }
});

/* test function */
exports.myFunction = functions.firestore
  .document('commands/{commandId}')
  .onCreate((snap, context) => {
    const { commandId } = context.params;
    const db = admin.firestore();
    return db.collection('games').doc().create({ status: 'LOBBY', commandId });
  });
