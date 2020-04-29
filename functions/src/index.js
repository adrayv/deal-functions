const uniqid = require('uniqid');
const { generateDeck } = require('./utils/deck');
const { shuffle } = require('./utils/array');

const functions = {
  createInitialGameState(initialPlayer) {
    const initialPlayerId = `${initialPlayer}-${uniqid()}`;
    return {
      turn: 0,
      cardsPlayed: 0,
      deck: shuffle(generateDeck()),
      discard: [],
      players: {
        [initialPlayerId]: {
          cash: [],
          hand: [],
          sets: [],
        },
      },
      order: [initialPlayerId],
      winner: null,
      status: 'NOT_READY',
      created_at: new Date(),
    };
  },
};

Object.keys(functions).forEach(functionName => {
  exports[functionName] = functions[functionName];
});
