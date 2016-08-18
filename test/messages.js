var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var IRCStream = require('../ircng');

var stream = {};
var spy = {};

beforeEach(function() {
    spy = sinon.spy();
    stream = new IRCStream();
});

describe('receiving a PING message', function() {
    it('should send a PONG with the parameter received', function() {
        stream.on('send', spy);
        stream.push('PING test\r\n');

        sinon.assert.calledOnce(spy);

        var returnedCommand = spy.getCall(0);
        expect(returnedCommand.args[0]).to.have.property('message').that.equals('PONG test\r\n');
    });
});

describe('receiving a numeric message', function() {
    it('should raise an event with the numeric', function() {
        stream.on('433', spy);
        stream.push(':source 433 * target :Error stuff\r\n');

        sinon.assert.calledOnce(spy);

        var returnedCommand = spy.getCall(0);
        expect(returnedCommand.args[0]).to.have.property('numeric').that.equals('433');
        expect(returnedCommand.args[0]).to.have.property('args').that.include('target');
        expect(returnedCommand.args[0]).to.have.property('args').that.include('Error stuff');
    });
});

describe('receiving a JOIN message', function() {
    it('should raise a join event', function() {
        stream.on('join', spy);
        stream.push(':nick!user@host JOIN :#test\r\n');

        sinon.assert.calledOnce(spy);

        var returnedCommand = spy.getCall(0);
        expect(returnedCommand.args[0]).to.have.property('source').that.equals('nick!user@host');
        expect(returnedCommand.args[0]).to.have.property('channel').that.equals('#test');
    });
});
