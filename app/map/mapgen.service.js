export function mapgenService(_tables, _objects, _lcg) {
  var _factory = {};

  var _sectors = [];
  var _map = null;

  _factory.noiseMap = function(seed, level) {
    var lcg = _lcg.create(seed);

    var noise = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    var max = 0;

    for (var k = 0; k < level; k++) {
      var div = Math.pow(2, k);
      max += 1 / div;
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          noise[i][j] += lcg.next() / div;
        }
      }
    }

    return {
      noise: noise,
      max: max
    };
  };

  _factory.sectorMap = function(seed, x, y, level, alt, size) {
    var map = [];

    var totalWeight = _.reduce(_tables.stellarObjectSimple, function(sum, obj) {
      return sum + obj.weight;
    }, 0);

    // Build the stellar objects table
    var _stellarObjects = [];
    _.forEach(_tables.stellarObjectSimple, function(so) {
      for (var i = 0; i < so.weight; i++) {
        _stellarObjects.push(so);
      }
    });

    for (var k = 0; k < size; k++) {
      map[k] = [];
      for (var l = 0; l < size; l++) {
        var section = [];
        var s = seed + x + y + k + l;
        var params = _factory.noiseMap(s, level);
        var lcg = _lcg.create(s);
        var altitude = params.max * alt;

        for (var i = 0; i < 10; i++) {
          section[i] = [];
          for (var j = 0; j < 10; j++) {
            if (params.noise[i][j] >= altitude) {
              var rand = lcg.random(0, totalWeight - 1);
              var obj = _stellarObjects[rand];
              section[i][j] = _objects.newSection(obj);
            } else {
              section[i][j] = {};
            }
          }
        }

        map[k][l] = _objects.newSector();
        map[k][l].sections = section;
      }
    }

    return map;
  };

  _factory.sectorMapNormalized = function(seed, x, y, level, alt, normal, size) {
    var params = _factory.noiseMap(seed + x + y, level);
    var altitude = params.max * alt;

    var map = [];

    var totalWeight = _.reduce(_tables.stellarObjectSimple, function(sum, obj) {
      return sum + obj.weight;
    }, 0);

    // Build the stellar objects table
    var _stellarObjects = [];
    _.forEach(_tables.stellarObjectSimple, function(so) {
      for (var i = 0; i < so.weight; i++) {
        _stellarObjects.push(so);
      }
    });

    var s = seed + x + y;

    var count = 0;
    var limiter = 0;
    while (count < normal && altitude > 0.0 && limiter < 5) {
      var lcg = _lcg.create(s);
      for (var i = 0; i < 10; i++) {
        map[i] = [];
        for (var j = 0; j < 10; j++) {
          if (params.noise[i][j] >= altitude) {
            var rand = lcg.random(0, totalWeight - 1);
            var obj = _stellarObjects[rand];
            map[i][j] = _objects.newSection(obj);
            count++;
          } else {
            map[i][j] = {};
          }
        }
      }

      if (count < normal) {
        altitude -= params.max * 0.01;
        count = 0;
      }
      limiter++;
    }

    return map;
  };

  _factory.generate = function(seed, x, y, size) {
    // This function generates a sectors worth of stellar objects.  A sector is
    // defined as a 10x10 grid of sections.  Each section contains 0 or 1
    // stellar objects.

    var sectors = [];

    var totalWeight = _.reduce(_tables.stellarObject, function(sum, obj) {
      return sum + obj.weight;
    }, 0);

    // Build the stellar objects table
    var _stellarObjects = [];
    _.forEach(_tables.stellarObject, function(so) {
      for (var i = 0; i < so.weight; i++) {
        _stellarObjects.push(so);
      }
    });


    for (var k = 0; k < size; k++) {
      sectors[k] = [];
      for (var l = 0; l < size; l++) {
        var s = seed + (x + k) + (y + l);
        var lcg = _lcg.create(s);

        // Generate the sections in the sector
        var sectorData = [];
        for (var i = 0; i < 10; i++) {
          sectorData[i] = [];
          for (var j = 0; j < 10; j++) {
            var rand = lcg.random(0, totalWeight - 1);
            var obj = _stellarObjects[rand];
            sectorData[i][j] = _objects.newSection(obj);
          }
        }

        sectors[k][l] = _objects.newSector();
        sectors[k][l].sections = sectorData;
      }
    }

    _sectors = sectors;

    return sectors;
  };

  _factory.staticMap = function() {
    return _map || {};
  };

  return _factory;
}

mapgenService.$inject = ["mobius-mapgen-tables", "mobius-mapgen-objects", "mobius-core-lcg"];
