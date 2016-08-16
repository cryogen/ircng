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

    describe('twice with valid messages', function() {
        it('should raise two seperate messages', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND argument\r\n');
            stream.push('COMMAND2 argument2\r\n');

            sinon.assert.calledTwice(spy);

            expect(spy.getCall(0).args[0]).to.have.property('command').that.equals('COMMAND');
            expect(spy.getCall(1).args[0]).to.have.property('command').that.equals('COMMAND2');
        });
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

    describe('with a message with no source and a single parameter', function() {
        it('should raise a message event with a single parameter', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 argument1\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);
            expect(returnedCommand.args[0]).to.have.property('args').to.be.instanceof(Array);
        });
    })

    describe('with a message with no source and multiple parameters', function() {
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

    describe('with a message with a source and multiple parameters', function() {
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

    describe('with a message with no source and a colon parameter', function() {
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

    describe('with a message with a source and a colon parameter', function() {
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

    describe('with a message with a source and a colon parameter that is not the first', function() {
        it('should raise a message with the colon parameter joined to the rest', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('message', spy);

            stream.push('COMMAND1 argument1 :argument2 argument3\r\n');

            sinon.assert.calledOnce(spy);

            var returnedCommand = spy.getCall(0);

            console.info(returnedCommand.args[0].args);
            
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument1');
            expect(returnedCommand.args[0]).to.have.property('args').that.include('argument2 argument3');
        });
    });
});

describe('Calling register', function() {
    describe('with no arguments', function() {
        it('should register with defaults', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('send', spy);

            stream.register();

            sinon.assert.calledTwice(spy);

            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('USER WebIRC * * :WebIRC User\r\n');
            expect(spy.getCall(1).args[0]).to.have.property('message').that.equals('NICK WebIRC\r\n');
        });
    });

    describe('with arguments specified', function () {
        it('should register with specified details', function() {
            var spy = sinon.spy();
            var stream = new IRCStream();

            stream.on('send', spy);

            stream.register({ nick: 'TestNick', username: 'TestUser', realname: 'TestReal' });

            sinon.assert.calledTwice(spy);

            expect(spy.getCall(0).args[0]).to.have.property('message').that.equals('USER TestUser * * :TestReal\r\n');
            expect(spy.getCall(1).args[0]).to.have.property('message').that.equals('NICK TestNick\r\n');
        });
    })
});
