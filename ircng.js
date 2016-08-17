'use strict';

const EventEmitter = require('events');

function parseMessage(line) {
    var split = line.split(' ');
    var command = '';
    var source = undefined;
    var argIndex = 1;
    var args = [];

    if(split[0][0] === ':') {
        source = split[0].slice(1);
        command = split[1];
        argIndex++;
    } else {
        command = split[0];
    }

    for(var i = argIndex; i < split.length; i++) {
        var currentArg = split[i];

        if(currentArg[0] === ':') {
            split[i] = split[i].slice(1);
            args.push(split.slice(i).join(' '));
            break;
        } else {
            args.push(currentArg);
        }
    }

    return {
        source: source,
        command: command,
        args: args
    };
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function handleCommand(stream, command) {
    if(isNumber(command.command)) {
        stream.emit(command.command, { 
            numeric: command.command, 
            args: command.args 
        });
    }

    switch(command.command) {
        case 'PING':
            stream.emit('send', { message: 'PONG ' + command.args[0] + '\r\n' });
            break
        case 'JOIN':
            stream.emit('join', { source: command.source, channel: command.args[0]} );
            break;
    }
}

function buildCommand(message) {
    return { message: message + '\r\n' };
}

class IRCStream extends EventEmitter {
    constructor() {
        super();
        this._buffer = '';
    }

    push(message) {
        if(!message || !message.length) {
            return;
        }

        var currentIndex = 0;

        this._buffer += message;
        var buffer = this._buffer;

        while(currentIndex <= buffer.length) {
            var newLineIndex = buffer.indexOf('\n', currentIndex);
            
            if(newLineIndex === -1) {
                return;
            }

            var messageLength = newLineIndex;
            var lastIndex = currentIndex;
            currentIndex += newLineIndex;

            if(buffer[newLineIndex - 1] === '\r') {
                messageLength--;
            }

            var line = buffer.substr(lastIndex, messageLength);
            buffer = buffer.slice(currentIndex + 1);
            var command = parseMessage(line);

            handleCommand(this, command);

            this.emit('message', command);

            currentIndex = 0;

            if(buffer.length === 0) {
                break;
            }
        }

        this._buffer = buffer;
    }

    register(params) {
        params = params || {};

        this.emit('send', buildCommand('USER ' + (params.username || 'WebIRC') + ' * * :' + (params.realname || 'WebIRC User')));
        this.emit('send', buildCommand('NICK ' + (params.nick || 'WebIRC')));
    }

    setNickname(newNickname) {
        if(!newNickname) {
            return;
        }

        this.emit('send', buildCommand('NICK ' + newNickname));
    }

    joinChannel(channel) {
        if(!channel) {
            return;
        }

        if(!channel.startsWith('#')) {
            channel = '#' + channel;
        }

        this.emit('send', buildCommand('JOIN ' + channel));
    }
}

module.exports = IRCStream;