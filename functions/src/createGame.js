const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const init = require('./game/init');

module.exports = functions.https.onRequest(async (req, res) => {
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
      .add(init.createInitialGameState(player));
    res.status(200).send({ gameId: docRef.id });
  } catch (error) {
    console.error('ERROR CREATING GAME', error);
    res.status(400).send(JSON.stringify(error));
  }
});
