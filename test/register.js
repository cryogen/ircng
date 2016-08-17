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

describe('Calling register', function() {
    describe('with no arguments', function() {
        it('should register with defaults', function() {
            stream.on('send', spy);
            stream.register();

            sinon.assert.calledTwice(spy);

            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('USER WebIRC * * :WebIRC User\r\n');
            expect(spy.getCall(1).args[0]).to.have.property('message').that.equals('NICK WebIRC\r\n');
        });
    });

    describe('with arguments specified', function () {
        it('should register with specified details', function() {
            stream.on('send', spy);
            stream.register({ nick: 'TestNick', username: 'TestUser', realname: 'TestReal' });

            sinon.assert.calledTwice(spy);

            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('USER TestUser * * :TestReal\r\n');
            expect(spy.getCall(1).args[0]).to.have.property('message').that.equals('NICK TestNick\r\n');
        });
    })
});
