const badAction = {
  type: '@bad-action',
  data: {},
};

module.exports = function (type, payload) {
  switch (type) {
    case '@join-game': {
      const { player } = payload;
      if (player) {
        return { type, data: payload };
      } else {
        return badAction;
      }
    }
    case '@start-game': {
      return { type };
    }
    default: {
      return badAction;
    }
  }
};
