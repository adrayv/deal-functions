const { reducer, actionCreators, gameStatuses } = require('../game/core');

test('playing a cash card', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [{ id: 'cash-val-2-4', type: 'cash', value: 2 }],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };
  const cardToPlay = state.players['p2'].hand[0];
  const newState = reducer(state, actionCreators.playCard('p2', cardToPlay));
  expect(
    newState.players['p2'].hand.find(card => card.id === cardToPlay.id)
  ).toBe(undefined);
  expect(newState.cardsPlayed).toBe(1);
  expect(
    Boolean(newState.players['p2'].cash.find(card => card.id === cardToPlay.id))
  ).toBe(true);
});

test('playing a property card', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [
          {
            id: 'property-orange-st-james',
            type: 'property',
            name: 'st-james',
            color: 'orange',
            value: 2,
          },
        ],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };
  const cardToPlay = state.players['p2'].hand[0];
  const newState = reducer(state, actionCreators.playCard('p2', cardToPlay));
  expect(
    newState.players['p2'].hand.find(card => card.id === cardToPlay.id)
  ).toBe(undefined);
  expect(newState.cardsPlayed).toBe(1);
  expect(
    Boolean(
      newState.players['p2'].sets.find(set =>
        set.cards.find(card => card.id === cardToPlay.id)
      )
    )
  ).toBe(true);
});

test('playing 3 cards', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [
      {
        id: 'property-mint-water-works',
        type: 'property',
        name: 'water-works',
        color: 'mint',
        value: 2,
      },
      {
        id: 'property-purple-st-charles',
        type: 'property',
        name: 'st-charles',
        color: 'purple',
        value: 2,
      },
    ],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [{ id: 'cash-val-1-0', type: 'cash', value: 1 }],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [
          {
            id: 'property-orange-st-james',
            type: 'property',
            name: 'st-james',
            color: 'orange',
            value: 2,
          },
          { id: 'cash-val-1-4', type: 'cash', value: 1 },
          { id: 'cash-val-1-5', type: 'cash', value: 1 },
        ],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };
  const cardsToPlay = state.players['p2'].hand.slice(0, 3);
  const nextPlayerCardCount = state.players['p1'].hand.length;
  const currentDeckCount = state.deck.length;
  let newState = state;
  for (let i = 0; i < cardsToPlay.length; i++) {
    newState = reducer(newState, actionCreators.playCard('p2', cardsToPlay[i]));
  }
  expect(newState.order[newState.turn]).toBe('p1');
  expect(newState.players['p1'].hand.length).toBe(nextPlayerCardCount + 2);
  expect(newState.deck.length).toBe(currentDeckCount - 2);
  expect(newState.cardsPlayed).toBe(0);
});

test('drawing a card', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [{ id: 'cash-val-1-0', type: 'cash', value: 1 }],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [
          { id: 'cash-val-1-4', type: 'cash', value: 1 },
          { id: 'cash-val-1-5', type: 'cash', value: 1 },
        ],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };
  const nextCardInDeck = state.deck[state.deck.length - 1];
  const currentDeckSize = state.deck.length;
  const currentPlayerCardCount = state.players['p2'].hand.length;

  const newState = reducer(state, actionCreators.drawCard('p2'));

  expect(newState.players['p2'].hand.length).toBe(currentPlayerCardCount + 1);
  expect(newState.deck.length).toBe(currentDeckSize - 1);
  expect(
    Boolean(
      newState.players['p2'].hand.find(card => card.id === nextCardInDeck.id)
    )
  ).toBe(true);
});

test('discarding a card', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [],
    discard: [{ id: 'cash-val-1-0', type: 'cash', value: 1 }],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [{ id: 'cash-val-1-4', type: 'cash', value: 1 }],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };

  const discardCount = state.discard.length;
  const cardToDiscard = state.players['p2'].hand[0];

  const newState = reducer(
    state,
    actionCreators.discardCard('p2', cardToDiscard)
  );

  expect(
    newState.players['p2'].hand.find(card => card.id === cardToDiscard.id)
  ).toBe(undefined);
  expect(newState.discard.length).toBe(discardCount + 1);
  expect(newState.discard[newState.discard.length - 1].id).toBe(
    cardToDiscard.id
  );
});

test('ending a turn', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [
      {
        id: 'property-mint-water-works',
        type: 'property',
        name: 'water-works',
        color: 'mint',
        value: 2,
      },
      {
        id: 'property-purple-st-charles',
        type: 'property',
        name: 'st-charles',
        color: 'purple',
        value: 2,
      },
    ],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };

  const { order, turn } = state;
  const currentPlayer = order[turn];
  const nextPlayerHandSize = state.players['p1'].hand.length;
  const currentDeckSize = state.deck.length;

  const newState = reducer(state, actionCreators.endTurn(currentPlayer));
  const { order: _order, turn: _turn, cardsPlayed } = newState;
  const nextPlayer = _order[_turn];
  expect(nextPlayer).toBe('p1');
  expect(cardsPlayed).toBe(0);
  expect(newState.players['p1'].hand.length).toBe(nextPlayerHandSize + 2);
  expect(newState.deck.length).toBe(currentDeckSize - 2);
});

test('completing a set', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [
          {
            id: 'property-green-pennsylvania',
            type: 'property',
            name: 'pennsylvania',
            color: 'green',
            value: 4,
          },
          {
            id: 'property-green-pacific',
            type: 'property',
            name: 'pacific',
            color: 'green',
            value: 4,
          },
          {
            id: 'property-green-north-carolina',
            type: 'property',
            name: 'north-carolina',
            color: 'green',
            value: 4,
          },
        ],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };

  const cardsToPlay = state.players['p2'].hand;
  let newState = state;
  for (let i = 0; i < cardsToPlay.length; i++) {
    newState = reducer(newState, actionCreators.playCard('p2', cardsToPlay[i]));
  }
  expect(
    Boolean(
      newState.players['p2'].sets.find(
        set => set.complete && set.color === 'green'
      )
    )
  ).toBe(true);
});

test('winning a game', () => {
  const state = {
    turn: 0,
    status: 'in-progress',
    cardsPlayed: 0,
    deck: [
      { id: 'cash-val-1-1', type: 'cash', value: 1 },
      { id: 'cash-val-4-0', type: 'cash', value: 4 },
      { id: 'cash-val-2-1', type: 'cash', value: 2 },
      { id: 'cash-val-1-4', type: 'cash', value: 1 },
      { id: 'cash-val-1-5', type: 'cash', value: 1 },
      { id: 'cash-val-3-2', type: 'cash', value: 3 },
      { id: 'cash-val-3-1', type: 'cash', value: 3 },
      { id: 'cash-val-5-0', type: 'cash', value: 5 },
      { id: 'cash-val-4-2', type: 'cash', value: 4 },
    ],
    discard: [],
    players: {
      p1: {
        properties: [],
        sets: [],
        cash: [],
        hand: [],
      },
      p2: {
        properties: [],
        cash: [],
        sets: [],
        hand: [
          {
            id: 'property-blue-park-place',
            type: 'property',
            name: 'park-place',
            color: 'blue',
            value: 4,
          },
          {
            id: 'property-blue-boardwalk',
            type: 'property',
            name: 'boardwalk',
            color: 'blue',
            value: 4,
          },
          {
            id: 'property-brown-medditerranean',
            type: 'property',
            name: 'medditerranean',
            color: 'brown',
            value: 1,
          },
          {
            id: 'property-brown-baltic',
            type: 'property',
            name: 'baltic',
            color: 'brown',
            value: 1,
          },
          {
            id: 'property-green-pennsylvania',
            type: 'property',
            name: 'pennsylvania',
            color: 'green',
            value: 4,
          },
          {
            id: 'property-green-pacific',
            type: 'property',
            name: 'pacific',
            color: 'green',
            value: 4,
          },
          {
            id: 'property-green-north-carolina',
            type: 'property',
            name: 'north-carolina',
            color: 'green',
            value: 4,
          },
        ],
      },
    },
    order: ['p2', 'p1'],
    winner: null,
  };

  let newState = state;
  const greenCards = state.players['p2'].hand.filter(
    card => card.type === 'property' && card.color === 'green'
  );
  expect(greenCards.length).toBe(3);
  for (let i = 0; i < greenCards.length; i++) {
    newState = reducer(newState, actionCreators.playCard('p2', greenCards[i]));
  }
  newState = reducer(newState, actionCreators.endTurn('p1'));

  const blueCards = newState.players['p2'].hand.filter(
    card => card.type === 'property' && card.color === 'blue'
  );
  expect(blueCards.length).toBe(2);
  for (let i = 0; i < blueCards.length; i++) {
    newState = reducer(newState, actionCreators.playCard('p2', blueCards[i]));
  }
  newState = reducer(newState, actionCreators.endTurn('p2'));
  newState = reducer(newState, actionCreators.endTurn('p1'));

  const brownCards = newState.players['p2'].hand.filter(
    card => card.type === 'property' && card.color === 'brown'
  );
  expect(brownCards.length).toBe(2);
  for (let i = 0; i < brownCards.length; i++) {
    newState = reducer(newState, actionCreators.playCard('p2', brownCards[i]));
  }

  expect(newState.winner).toBe('p2');
  expect(newState.status).toBe(gameStatuses.done);
});
