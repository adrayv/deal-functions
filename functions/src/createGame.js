const functions = require('firebase-functions');
const admin = require('firebase-admin');
const init = require('./game/init');
const { Player } = require('./game/entities');
const cors = require('cors')({
  origin: true,
});

module.exports = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    (async () => {
      try {
        if (req.method !== 'POST') {
          throw new Error('Resource not found');
        }
        const db = admin.firestore();
        const { player } = req.body;
        if (!player) {
          throw new Error('Missing body arg, player');
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
    })();
  });
});
