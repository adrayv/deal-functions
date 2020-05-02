const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Player } = require('./game/entities');
const { reducer, actionCreators } = require('./game/core');
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
        const { gameId, player } = req.body;
        if (gameId && player) {
          const newPlayer = Player(player);
          const db = admin.firestore();

          const gameState = (
            await db.collection('games').doc(gameId).get()
          ).data();

          const newState = reducer(
            gameState,
            actionCreators.joinGame(newPlayer)
          );
          await db.collection('games').doc(gameId).set(newState);

          return res
            .status(200)
            .send({ playerId: newPlayer.id, playerName: newPlayer.name });
        } else {
          throw new Error('Invalid body');
        }
      } catch (error) {
        console.error('ERROR JOINING GAME', error);
        res.status(400).send('Error Joining Game');
      }
    })();
  });
});
