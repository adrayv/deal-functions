const functions = require('firebase-functions');
const db = require('./services/db');

module.exports = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Resource not found');
    }
    const { gameId, type, payload } = req.body;
    if (gameId && type && payload) {
      await db.collection('commands').add({ gameId, type, payload });
    } else {
      throw new Error('Invalid body');
    }
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('ERROR CREATING GAME', error);
    res.status(400).send(JSON.stringify(error));
  }
});
