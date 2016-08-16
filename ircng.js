'use strict';

const EventEmitter = require('events');

function processMessage(line) {
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

    if(split[argIndex][0] === ':') {
        split[argIndex] = split[argIndex].slice(1);
        args = (split.slice(argIndex).join(' '));
    } else {
        args = split.slice(argIndex);
    }

    return {
        source: source,
        command: command,
        args: args
    };
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
            var command = processMessage(line);

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

        this.emit('send', { message: 'USER ' + (params.username || 'WebIRC') + ' * * :' + (params.realname || 'WebIRC User') + '\r\n'});
        this.emit('send', { message: 'NICK ' + (params.nick || 'WebIRC') + '\r\n'});
    }
}

module.exports = IRCStream;