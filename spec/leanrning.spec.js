var hubot = require('./helpers/hubot_helper')();
var l = require('../src/leaning')(hubot.robot);

describe('learning', function() {
  describe('create', function() {
    beforeEach(function() {
      this.regex = /create\s(.+?)\s(.+)/i;
      this.initialData = { a: 'aaa', b: 'bbb' };
      hubot.setRedis({dic: this.initialData});
    });

    describe('when key is new', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'c', 'new val']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('add new value', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('c is created as new val');
        expect(hubot.getRedis()['dic']['c']).toBe('new val');
      });
    });

    describe('when key is exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'a', 'new val']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('do nothing', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('a is exist, please use another key or update');
        expect(hubot.getRedis()['dic']).toEqual(this.initialData);
      });
    });
  });

  describe('list', function() {
    beforeEach(function() {
      this.regex = /list/i;
    });

    describe('when empty list', function() {
      beforeEach(function() {
        hubot.setRedis({});
        this.ret = hubot.execRespond(this.regex);
      });

      it ('say "nothing', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('I have nothing');
      });
    });

    describe('when no empty list', function() {
      beforeEach(function() {
        hubot.setRedis({dic: { a: 'aaa', b: 'bbb' } });
        this.ret = hubot.execRespond(this.regex);
      });

      it ('say exist keys', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('a');
        expect(hubot.res.send).toHaveBeenCalledWith('b');
      });
    });
  });
});
