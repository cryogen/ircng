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

describe('calling joinChannel', function() {
    describe('with no arguments', function() {
        it('should send no messages', function() {
            stream.on('send', spy);
            stream.joinChannel();

            sinon.assert.notCalled(spy);
        });
    });

    describe('with no leading #', function() {
        it('should send a message to join the channel and add a # to the name', function() {
            stream.on('send', spy);
            stream.joinChannel('test');

            sinon.assert.calledOnce(spy);
            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('JOIN #test\r\n');
        });
    });
});

describe('calling leaveChannel', function() {
    describe('with no arguments', function() {
        it('should send no messages', function() {
            stream.on('send', spy);
            stream.leaveChannel();

            sinon.assert.notCalled(spy);
        });
    });

    describe('with no leading #', function() {
        it('should send a message to part the channel and add a # to the name', function() {
            stream.on('send', spy);
            stream.leaveChannel('test');

            sinon.assert.calledOnce(spy);
            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('PART #test\r\n');
        });
    });
});

describe('calling sendMessage', function() {
    describe('with no arguments', function() {
        it('should send no messages', function() {
            stream.on('send', spy);
            stream.sendMessage();

            sinon.assert.notCalled(spy);
        });
    });

    describe('with no message', function() {
        it('should send no messages', function() {
            stream.on('send', spy);
            stream.sendMessage('test');

            sinon.assert.notCalled(spy);
        });
    });

    describe('with a target and a message', function() {
        it('should send a message to the target', function() {
            stream.on('send', spy);
            stream.sendMessage('#test', 'test message');

            sinon.assert.calledOnce(spy);
            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('PRIVMSG #test :test message\r\n');
        });
    });
});
