var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var IRCStream = require('../ircng');

describe('receiving a PING message', function() {
    it('should send a PONG with the parameter received', function() {
        var spy = sinon.spy();
        var stream = new IRCStream();

        stream.on('send', spy);

        stream.push('PING test\r\n');

        sinon.assert.calledOnce(spy);

        var returnedCommand = spy.getCall(0);
        expect(returnedCommand.args[0]).to.have.property('message').that.equals('PONG test\r\n');
    });
});