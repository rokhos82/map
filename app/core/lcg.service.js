export function lcgService() {
  var _lcg = function(seed) {
    this.M = 4294967296;
    this.A = 1664525;
    this.C = 1;
    this.Z = seed;
  };

  _lcg.prototype.next = function() {
    this.Z = (this.A * this.Z + this.C) % this.M;
    return this.Z / this.M;
  };

  _lcg.prototype.random = function(low,high) {
    var r = high - low;
    return Math.floor(low + this.next() * r);
  };

  var _factory = {};

  _factory.create = function(seed) {
    return new _lcg(seed);
  };

  return _factory;
}

lcgService.$inject = [];
