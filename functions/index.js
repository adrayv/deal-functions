const admin = require('firebase-admin');
admin.initializeApp();

exports.create = require('./src/createGame');
exports.commandRouter = require('./src/commandRouter');
exports.createCommand = require('./src/createCommand');
