const functions = require('firebase-functions');
const admin = require('firebase-admin');
const init = require('./game/init');
const { Player } = require('./game/entities');

module.exports = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const { player } = req.query;
    if (!player) {
      throw new Error(
        'attach the name of the initial player as a query parameter i.e. ?player=john'
      );
    }
    const newPlayer = Player(player);
    const docRef = await db
      .collection('games')
      .add(init.createInitialGameState(newPlayer));
    res.status(200).send({
      gameId: docRef.id,
      playerId: newPlayer.id,
      playerName: player.name,
    });
  } catch (error) {
    console.error('ERROR CREATING GAME', error);
    res.status(400).send(JSON.stringify(error));
  }
});
