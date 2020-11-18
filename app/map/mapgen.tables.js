function controller() {
  var _tables = {};

  _tables.stellarObject = [
    {
      table:"stellarObject",
      weight: 1857,
      subtable: undefined,
      text: ""
    },{
      table:"stellarObject",
      weight: 30,
      subtable: "deepSpaceSpecials",
      text: "O"
    },{
      table:"stellarObject",
      weight: 30,
      subtable: "deepSpaceSpecials",
      text: "B"
    },{
      table:"stellarObject",
      weight: 45,
      subtable: "deepSpaceSpecials",
      text: "A"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Neu"
    },{
      table:"stellarObject",
      weight: 50,
      subtable: "deepSpaceSpecials",
      text: "F"
    },{
      table:"stellarObject",
      weight: 150,
      subtable: "deepSpaceSpecials",
      text: "G"
    },{
      table:"stellarObject",
      weight: 200,
      subtable: "deepSpaceSpecials",
      text: "K"
    },{
      table:"stellarObject",
      weight: 350,
      subtable: "deepSpaceSpecials",
      text: "M"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Rad"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Ast"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Ion"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Mag"
    },{
      table:"stellarObject",
      weight: 150,
      subtable: "nebula",
      text: "Neb"
    },{
      table:"stellarObject",
      weight: 1,
      subtable: undefined,
      text: "Grv"
    },{
      table:"stellarObject",
      weight: 1,
      subtable: undefined,
      text: "Hyp"
    },{
      table:"stellarObject",
      weight: 3,
      subtable: "wormhole",
      text: "Wrm"
    }
  ];

  _tables.stellarObjectSimple = [
    {
      table:"stellarObject",
      weight: 30,
      subtable: "deepSpaceSpecials",
      text: "O"
    },{
      table:"stellarObject",
      weight: 30,
      subtable: "deepSpaceSpecials",
      text: "B"
    },{
      table:"stellarObject",
      weight: 45,
      subtable: "deepSpaceSpecials",
      text: "A"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Neu"
    },{
      table:"stellarObject",
      weight: 50,
      subtable: "deepSpaceSpecials",
      text: "F"
    },{
      table:"stellarObject",
      weight: 150,
      subtable: "deepSpaceSpecials",
      text: "G"
    },{
      table:"stellarObject",
      weight: 200,
      subtable: "deepSpaceSpecials",
      text: "K"
    },{
      table:"stellarObject",
      weight: 350,
      subtable: "deepSpaceSpecials",
      text: "M"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Rad"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Ast"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Ion"
    },{
      table:"stellarObject",
      weight: 5,
      subtable: undefined,
      text: "Mag"
    },{
      table:"stellarObject",
      weight: 150,
      subtable: "nebula",
      text: "Neb"
    },{
      table:"stellarObject",
      weight: 1,
      subtable: undefined,
      text: "Grv"
    },{
      table:"stellarObject",
      weight: 1,
      subtable: undefined,
      text: "Hyp"
    },{
      table:"stellarObject",
      weight: 3,
      subtable: "wormhole",
      text: "Wrm"
    }
  ];

  _tables.planetsPerSection = {
    O: function() { return _.random(1,3); },
    B: function() { return _.random(1,5); },
    A: function() { return _.random(1,7); },
    F: function() { return _.random(1,12); },
    G: function() { return _.random(1,20); },
    K: function() { return _.random(1,18); },
    M: function() { return _.random(1,15); },
    other: function() { return _.random(1,2); }
  };

  _tables.anomolies = [
    {
      text: "No Anomoly",
      weight: 89,
      subtable: null
    },{
      text: "Strategic Resource",
      weight: 10,
      subtable: "srp"
    },{
      text: "Special Strategic Resource",
      weight: 10,
      subtable: "ssrp"
    }
  ];

  _tables.srp = [
    {
      text: "Wood/Construction Materials",
      weight: 5,
      subtable: null
    },{
      text: "Food/Agriculture",
      weight: 5,
      subtable: null
    },{
      text: "Iron/Nickel Deposits",
      weight: 1,
      subtable: null
    }
  ];

  _tables.ssrp = [
    {
      text: "Natural Magnetic Monopoles",
      weight: 1,
      subtable: null
    }
  ];

  return _tables;
}

controller.$inject = [];

angular.module('mobius.mapgen').factory('mobius.mapgen.tables',controller);
