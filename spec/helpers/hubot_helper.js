module.exports = function() {
  var responds = {};
  var robot = {};

  // pool respond
  robot.respond = function(reg, cb) {
    responds[reg] = cb;
  };

  // brain setting
  robot.brain = {};
  var expectBrainGet = function(cb) {
    robot.brain.get = cb;
  };

  // response setting
  var res = {};
  res.send = jasmine.createSpy();

  // do response
  var execRespond = function(reg) {
    return responds[reg](res);
  }

  return {
    execRespond: execRespond,
    expectBrainGet: expectBrainGet,
    robot: robot,
    res: res
  };
}
