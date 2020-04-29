const types = {
  cash: {
    1: 6,
    2: 5,
    3: 3,
    4: 3,
    5: 2,
    10: 1,
  },
  houses: {
    count: 3,
    value: 3,
  },
  hotels: {
    count: 2,
    value: 4,
  },
  actions: {
    rent: {
      'sky-brown': {
        value: 1,
        count: 2,
      },
      'railroad-utility': {
        value: 1,
        count: 2,
      },
      'blue-green': {
        value: 1,
        count: 2,
      },
      'yellow-red': {
        value: 1,
        count: 2,
      },
      'purple-orange': {
        value: 1,
        count: 2,
      },
      any: {
        value: 3,
        count: 3,
      },
    },
    dealbreaker: {
      value: 5,
      count: 2,
    },
    'say-no': {
      value: 4,
      count: 3,
    },
    'pass-go': {
      value: 1,
      count: 10,
    },
    misc: {
      'debt-collector': {
        value: 3,
        count: 3,
      },
      'forced-deal': {
        value: 3,
        count: 3,
      },
      'double-rent': {
        value: 1,
        count: 2,
      },
      'sly-deal': {
        value: 3,
        count: 3,
      },
      birthday: {
        value: 2,
        count: 3,
      },
    },
  },
  properties: {
    special: {
      wild: {
        value: 0,
        count: 2,
        colors: 'any',
      },
      'blue-green': {
        value: 4,
        count: 1,
      },
      'sky-brown': {
        value: 1,
        count: 1,
      },
      'yellow-red': {
        value: 3,
        count: 2,
      },
      'purple-orange': {
        value: 2,
        count: 2,
      },
      'railroad-green': {
        value: 4,
        count: 1,
      },
      'railroad-sky': {
        value: 4,
        count: 1,
      },
      'railroad-mint': {
        value: 2,
        count: 1,
      },
    },
    regular: {
      purple: {
        value: 2,
        count: 3,
        names: ['virginia-ave', 'states-ave', 'st-charles'],
      },
      green: {
        value: 4,
        count: 3,
        names: ['pennsylvania', 'pacific', 'north-carolina'],
      },
      brown: {
        value: 1,
        count: 2,
        names: ['baltic', 'medditerranean'],
      },
      red: {
        value: 3,
        count: 3,
        names: ['illinois', 'kentucky', 'indiana'],
      },
      orange: {
        value: 2,
        count: 3,
        names: ['tennessee', 'new-york', 'st-james'],
      },
      blue: {
        value: 4,
        count: 2,
        names: ['boardwalk', 'park-place'],
      },
      yellow: {
        value: 3,
        count: 3,
        names: ['atlantic', 'marvin-gardens', 'ventnor-ave'],
      },
      sky: {
        value: 1,
        count: 3,
        names: ['oriental', 'connecticut', 'vermont'],
      },
      mint: {
        value: 2,
        count: 2,
        names: ['water-works', 'electric-company'],
      },
      black: {
        value: 2,
        count: 4,
        names: ['short-line', 'pennsylvania', 'bo', 'reading'],
      },
    },
  },
};

module.exports.generateDeck = () => {
  return Object.entries(types)
    .flatMap(([type, data]) => {
      if (type === 'cash') {
        return Object.entries(data).flatMap(([denomination, count]) => {
          return [...new Array(count)].map((_, i) => {
            return {
              id: `cash-val-${denomination}-${i}`,
              type: 'cash',
              value: Number(denomination),
            };
          });
        });
      } else if (type === 'properties') {
        return Object.entries(data.regular).flatMap(([color, propData]) => {
          return propData.names.map(name => ({
            id: `property-${color}-${name}`,
            type: 'property',
            name,
            color,
            value: propData.value,
          }));
        });
      } else return null;
    })
    .filter(e => e);
};