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

describe('calling setNickname', function() {
    describe('with no arguments', function() {
        it('should send no messages', function() {
            stream.on('send', spy);
            stream.setNickname();

            sinon.assert.notCalled(spy);
        });
    });

    describe('with a new nickname', function() {
        it('should send a message with the new nickname', function() {
            stream.on('send', spy);
            stream.setNickname('new');

            sinon.assert.calledOnce(spy);
            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('NICK new\r\n');
        });
    });
});