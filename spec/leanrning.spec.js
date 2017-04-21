var hubot = require('./helpers/hubot_helper')();
var l = require('../src/leaning')(hubot.robot);

describe('learning', function() {
  describe('list', function() {
    describe('when empty list', function() {
      beforeEach(function() {
        hubot.expectBrainGet(function(key) {
          return {};
        });
        this.ret = hubot.execRespond(/list/i);
      });

      it ('say "nothing', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('I have nothing');
      });
    });

    describe('when no empty list', function() {
      beforeEach(function() {
        hubot.expectBrainGet(function(key) {
          return {a: 'a', b: 'bbb'};
        });
        this.ret = hubot.execRespond(/list/i);
      });

      it ('list exist keys', function() {
        expect(hubot.res.send).toHaveBeenCalledWith('a');
        expect(hubot.res.send).toHaveBeenCalledWith('b');
      });
    });
  });
});
