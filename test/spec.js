var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var IRCStream = require('../ircng');

describe('Pushing a string', function() {
    describe('that is undefined', function() {
        it('should not raise a message event', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push();

            sinon.assert.notCalled(spy);
        });
    });

    describe('that is not a string', function() {
        it('should not raise a message event', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push(1);

            sinon.assert.notCalled(spy);
        });
    });

    describe('with no CR or LF characters', function() {
        it('should not raise a message event', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('TEST DATA NOT CONTAINING CR OR LF');

            sinon.assert.notCalled(spy);
        });
    });

    describe('with one CRLF in it', function() {
        it('should raise a message event with one command', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND argument\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);

            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND');
        });
    });

    describe('with one CR and no LF', function() {
        it('should raise a message event with one command', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND argument\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND');
        });
    });

    describe('with two CRLFs', function() {
        it('should raise two message events, with both commands in', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 argument1\r\nCOMMAND2 argument2\r\n');

            sinon.assert.calledTwice(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND1');

            returnedCommand = spy.getCall(1);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND2');
        });
    });

    describe('with two CRs', function() {
        it('should raise two message events, with both commands in', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 argument1\nCOMMAND2 argument2\n');

            sinon.assert.calledTwice(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND1');

            returnedCommand = spy.getCall(1);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND2');
        });
    });

    describe('with CRLF over two messages', function() {
        it('should raise a message event', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 arg');
            stream.push('ument\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND1');
        })
    });

    describe('with a source', function() {
        it('should raise a message with the source set', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push(':source COMMAND1 argument\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('command').that.equals('COMMAND1');
            expect(returnedCommand.args[0]).to.have.property('source').that.equals('source');
        });
    });

    describe('a message with no source and multiple parameters', function() {
        it('should raise a message event with multiple parameters', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 argument1 argument2 argument3\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument1');
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument2');
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument3');
        });
    });

    describe('a message with a source and multiple parameters', function() {
        it('should raise a message event with multiple parameters', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push(':source COMMAND1 argument1 argument2 argument3\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument1');
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument2');
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument3');
        });
    });

    describe('a message with no source and a colon parameter', function() {
        it('should raise a message event with one parameter', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 :argument1 argument2\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument1 argument2');
        });
    });

    describe('a message with a source and a colon parameter', function() {
        it('should raise a message event with one parameter', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push(':source COMMAND1 :argument1 argument2\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument1 argument2');
        });
    });
});

