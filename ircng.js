'use strict';

const EventEmitter = require('events');

function processMessage(line) {
    var split = line.split(' ');

    return {
        command: split[0],
        args: split[1]
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
        }

        this._buffer = buffer;
    }
}

module.exports = IRCStream;