var hubot = require('./helpers/hubot_helper')();
var l = require('../src/leaning')(hubot.robot);

describe('learning', function() {
  beforeEach(function() {
    hubot.res.send = jasmine.createSpy();
    this.initialData = { a: 'aaa', b: 'bbb' };
    hubot.setRedis({dic: this.initialData});
  });

  describe('create', function() {
    beforeEach(function() {
      this.regex = /create\s(.+?)\s(.+)/i;
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

  describe('update', function() {
    beforeEach(function() {
      this.regex = /update\s(.+?)\s(.+)/i;
    });

    describe('when key is exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'a', 'updAaa']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('update value', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('a is updated to updAaa');
        expect(hubot.getRedis()['dic']['a']).toBe('updAaa');
      });
    });

    describe('when key is not exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'c', 'updCcc']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('do nothing', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('c is not exist');
        expect(hubot.getRedis()['dic']).toBe(this.initialData);
      });
    });
  });

  describe('delete', function() {
    beforeEach(function() {
      this.regex = /delete\s(.+)/i;
    });

    describe('when key is exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'a']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('delete value', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('completed to delete a');
        expect(hubot.getRedis()['dic']).toEqual({ b: 'bbb' });
      });
    });

    describe('when key is not exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'c']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('do nothing', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('c is not exist');
        expect(hubot.getRedis()['dic']).toBe(this.initialData);
      });
    });
  });

  describe('please', function() {
    beforeEach(function() {
      this.regex = /please\s(.+)/i;
    });

    describe('when key is exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'a']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('delete value', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('a is aaa!');
      });
    });

    describe('when key is not exist', function() {
      beforeEach(function() {
        hubot.setResponseMatch(['', 'c']);
        this.ret = hubot.execRespond(this.regex);
      });

      it('do nothing', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('c is not exist');
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
        this.ret = hubot.execRespond(this.regex);
      });

      it ('say exist keys', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('a');
        expect(hubot.res.send).toHaveBeenCalledWith('b');
      });
    });
  });
});
