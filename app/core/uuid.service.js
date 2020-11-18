function uuidService() {
  var _factory = {};

  _factory.v4 = function() {
    var time_low = Math.floor(0xFFFFFFFF * Math.random());
    var time_mid = Math.floor(0xFFFF * Math.random());
    var time_high = (Math.floor(0x4FFF * Math.random()) | 0x4000) & 0x4FFF;
    var clock = (Math.floor(0x7FFF * Math.random()) | 0x4000) & 0x7FFF;
    var node = Math.floor(0xFFFFFFFFFFFF * Math.random());

    var tl = _.padStart(time_low.toString(16),8,'0');
    var tm = _.padStart(time_mid.toString(16),4,'0');
    var th = _.padStart(time_high.toString(16),4,'0');
    var c = _.padStart(clock.toString(16),4,'0');
    var n = _.padStart(node.toString(16),12,'0');
    return `${tl}-${tm}-${th}-${c}-${n}`;
  };

  return _factory;
}

uuidService.$inject = [];

angular.module('mobius-core').factory('mobius-core-uuid',uuidController);
