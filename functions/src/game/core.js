const { Player } = require('./entities');

const config = {
  maxPlayers: 4,
};

const gameStatuses = {
  pending: 'pending',
  ready: 'ready',
  inProgress: 'in-progress',
  done: 'done',
};

const actionTypes = {
  joinGame: '@join-game',
  startGame: '@start-game',
  playCard: '@play-card',
  drawCard: '@draw-card',
  discardCard: '@discard-card',
  endTurn: '@end-turn',
};

const numToComplete = {
  purple: 3,
  green: 3,
  brown: 2,
  red: 3,
  orange: 3,
  blue: 2,
  yellow: 3,
  sky: 3,
  mint: 2,
  black: 4,
};

function playerWon(playerId, state) {
  const numCompleteSets = state.players[playerId].sets.reduce(
    (numCompleteSets, set) => {
      if (set.complete) {
        return numCompleteSets + 1;
      }
      return numCompleteSets;
    },
    0
  );
  return numCompleteSets >= 3;
}

function setIsComplete(set) {
  const numPropertiesInSet = set.cards.reduce((numProperties, card) => {
    if (card.type === 'property') {
      return numProperties + 1;
    }
    return numProperties;
  }, 0);
  return numPropertiesInSet === numToComplete[set.color];
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.joinGame: {
      const { player } = action.data;
      const newState = Object.assign({}, state);
      const { status, order } = newState;
      if (
        (status === gameStatuses.pending || status === gameStatuses.ready) &&
        order.length < config.maxPlayers
      ) {
        const newPlayer = Player(player);
        newState.players[newPlayer.id] = newPlayer;
        newState.order.push(newPlayer.id);
        if (newState.order.length > 1) {
          newState.status = gameStatuses.ready;
        }
      }
      return newState;
    }
    case actionTypes.startGame: {
      let newState = Object.assign({}, state);
      if (newState.status === gameStatuses.ready) {
        newState.status = gameStatuses.inProgress;
        // Distribute cards
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < newState.order.length; j++) {
            const playerId = order[j];
            newState = reducer(newState, {
              type: actionTypes.drawCard,
              data: { playerId },
            });
          }
        }
      }
      return newState;
    }
    case actionTypes.playCard: {
      const { playerId, card } = action.data;
      const newState = Object.assign({}, state);
      const { order, turn, players } = newState;

      if (playerId === order[turn]) {
        switch (card.type) {
          case 'cash': {
            newState.players[playerId].cash.push(card);
            break;
          }
          case 'property': {
            const targetSetIndex = players[playerId].sets.findIndex(
              set => set.color === card.color && !set.complete
            );
            if (targetSetIndex !== -1) {
              newState.players[playerId].sets[targetSetIndex].cards.push(card);
              if (
                setIsComplete(newState.players[playerId].sets[targetSetIndex])
              ) {
                newState.players[playerId].sets[targetSetIndex].complete = true;
              }
            } else {
              newState.players[playerId].sets.push({
                color: card.color,
                complete: false,
                cards: [card],
              });
            }
            if (playerWon(playerId, newState)) {
              newState.winner = playerId;
            }
            break;
          }
          default: {
            // continue
          }
        }
        newState.players[playerId].hand = players[playerId].hand.filter(
          ({ id: cid }) => cid !== card.id
        );
        newState.cardsPlayed++;
        if (newState.cardsPlayed >= 3) {
          return reducer(newState, {
            type: actionTypes.endTurn,
            data: {
              playerId,
            },
          });
        }
      }
      return newState;
    }
    case actionTypes.drawCard: {
      const { playerId } = action.data;
      const newState = Object.assign({}, state);
      const drawnCard = newState.deck.pop();
      newState.players[playerId].hand.push(drawnCard);
      return newState;
    }
    case actionTypes.discardCard: {
      const { playerId, card } = action.data;
      const newState = Object.assign({}, state);
      newState.players[playerId].hand = newState.players[playerId].hand.filter(
        ({ id: cid }) => cid !== card.id
      );
      newState.discard.push(card);
      return newState;
    }
    case actionTypes.endTurn: {
      const newState = Object.assign({}, state);
      newState.turn =
        newState.turn < newState.order.length - 1 ? newState.turn + 1 : 0;
      newState.players[newState.order[newState.turn]].hand.push(
        newState.deck.pop()
      );
      newState.players[newState.order[newState.turn]].hand.push(
        newState.deck.pop()
      );
      newState.cardsPlayed = 0;
      return newState;
    }
    default:
      return state;
  }
}

exports.reducer = reducer;
exports.gameStatuses = gameStatuses;
