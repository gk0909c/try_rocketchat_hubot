module.exports = function() {
  var responds = {};
  var robot = {};
  var redis = {};

  // pool respond
  robot.respond = function(reg, cb) {
    responds[reg] = cb;
  };

  // brain setting
  robot.brain = {};
  robot.brain.get = function(key) {
    return redis[key];
  };
  robot.brain.set = function(key, value) {
    redis[key] = value;
  };
  var setRedis = function(hash) {
    redis = hash;
  }
  var getRedis = function() {
    return redis;
  }

  // response setting
  var res = {};
  var setResponseMatch = function(matches) {
    res.match = matches;
  };

  // do response
  var execRespond = function(reg) {
    return responds[reg](res);
  }

  return {
    execRespond: execRespond,
    setResponseMatch: setResponseMatch,
    setRedis: setRedis,
    getRedis: getRedis,
    robot: robot,
    res: res
  };
}
