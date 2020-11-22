export function mapgenObjects(tables,lcgParams) {
  var _factory = {};

  var _sectorObject = {
    neighbors: {
      up: null,
      down: null,
      left: null,
      right: null
    },
    sections: []
  };

  var _sectionObject = {
    stellarObject: null,
    planets: [],
    planetCount: 0,
    text: ""
  };

  var _parameters = {
    seed: 0,
    levels: 3,
    normalized: false,
    altitude: 0.75
  };

  _factory.newSector = function() {
    return _.clone(_sectorObject);
  };

  _factory.newSection = function(star) {
    var section = _.clone(_sectionObject);
    section.stellarObject = star;
    if (_.has(tables.planetsPerSection, star.text)) {
      section.planetCount = tables.planetsPerSection[star.text]();
    } else if (star.text === "") {
      section.planetCount = 0;
    } else {
      section.planetCount = tables.planetsPerSection.other();
    }
    section.text = star.text;
    return section;
  };

  _factory.parameters = function(seed) {
    var params = _.clone(_parameters);
    params.seed = seed ? seed : (_.random(0,lcgParams.M));
    return params;
  };

  return _factory;
}

mapgenObjects.$inject = ["mapgenTables","mobius-core-lcg"];
