const uniqid = require('uniqid');

exports.Player = function (player) {
  const playerName = String(player).trim().slice(0, 10);
  const playerId = `${playerName}-${uniqid()}`;
  return {
    id: playerId,
    name: playerName,
    cash: [],
    hand: [],
    sets: [],
  };
};
