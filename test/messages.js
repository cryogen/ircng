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

describe('receiving a numeric message', function() {
    it('should raise an event with the numeric', function() {
        var spy = sinon.spy();
        var stream = new IRCStream();

        stream.on('433', spy);

        stream.push(':source 433 * target :Error stuff\r\n');

        sinon.assert.calledOnce(spy);

        var returnedCommand = spy.getCall(0);
        expect(returnedCommand.args[0]).to.have.property('numeric').that.equals('433');
        expect(returnedCommand.args[0]).to.have.property('args').that.include('target');
        expect(returnedCommand.args[0]).to.have.property('args').that.include('Error stuff');
    });
})