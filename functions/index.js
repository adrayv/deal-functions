const admin = require('firebase-admin');
admin.initializeApp();

exports.createGame = require('./src/createGame');
exports.joinGame = require('./src/joinGame');
exports.commandRouter = require('./src/commandRouter');
exports.createCommand = require('./src/createCommand');
