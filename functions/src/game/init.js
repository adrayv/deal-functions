const { generateDeck } = require('../utils/deck');
const { shuffle } = require('../utils/array');
const { gameStatuses } = require('./core');

module.exports = {
  createInitialGameState(initialPlayer) {
    return {
      turn: 0,
      cardsPlayed: 0,
      deck: shuffle(generateDeck()),
      discard: [],
      players: {
        [initialPlayer.id]: initialPlayer,
      },
      order: [initialPlayer.id],
      winner: null,
      status: gameStatuses.pending,
      created_at: new Date(),
    };
  },
};
