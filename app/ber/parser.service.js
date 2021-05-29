export function parser() {
  let _service = {};

  _service.parseFleet = (fleetString) => {
    // Get the first line: fleet info
    // RACE, FLEET, BREAK, # UNITS, TOTAL HULL, TARGET, ##, ##, ##
    // All subsequent lines are units

    // Break the fleet string by new line character
    console.log(fleetString);
    let lines = _(fleetString).split(/(\n|\r|\n\r|\r\n)/).filter((str) => { return str === "\n" ? null : str; }).value();
    console.log(lines);

    // Extract fleet info
    let fleet = {};
    let fleetInfo = _(lines[0]).split(",").value();
    console.log(fleetInfo);
    fleet.race = fleetInfo[0];
    fleet.name = fleetInfo[1];
    fleet.break = fleetInfo[2];
    fleet.target = fleetInfo[5];

    // Parse Unit Description Lines (UDLs).
    let units = [];
    for(let i = 1;i < lines.length;i++) {
      units.push(_service.parseUnit(lines[i]));
    }
    fleet.units = units;

    console.log(fleet);
    return fleet;
  };

  _service.parseUnit = (unitString) => {
    // Unit Line Format:
    // BM := BEAM
    // SH := SHIELD
    // TP := TORPEDO
    // HL := HULL
    // CUR := CURRENT
    // UNIT NAME, MAX BM, CUR BM, MAX SH, CUR SH, MAX TP, CUR TP, MAX HL, CUR HUL, ##, ##, ##,TAGS
    let unit = {};

    let unitInfo = _(unitString).split(",").value();
    console.log(unitInfo);

    unit.name = unitInfo[0];
    unit.bmMax = unitInfo[1];
    unit.bmCur = unitInfo[2];
    unit.shMax = unitInfo[3];
    unit.shCur = unitInfo[4];
    unit.tpMax = unitInfo[5];
    unit.tpCur = unitInfo[6];
    unit.hlMax = unitInfo[7];
    unit.hlCur = unitInfo[8];

    let tags = unitInfo[12];

    unit.tags = _service.parseTags(tags);

    console.log(unit);

    return unit;
  };

  _service.parseTags = (tagString) => {
    // Repeatedly strip the first substring out; analyze it; consume more depending on the tag; end when string is empty.
    // Look for brackets first.
    let brackets = _(tagString).words(/\[.+?\]/g).value();
    // Get the unit's defense value
    let unitDefense = _(tagString).words(/DEFENSE \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's target value
    let unitTarget = _(tagString).words(/TARGET \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's resist value
    let unitResist = _(tagString).words(/RESIST \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's flicker value
    let unitFlicker = _(tagString).words(/FLICKER \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's break value if it exists.  Default value of 100 := fights to the last man
    let unitBreak = _(tagString).words(/BREAK \d+/).words(/\d+/).map(x=>+x).value()[0] || 100;
    // Get the unit's damage value if it exists.  Default value of 0 := fights to the death.
    let unitDamage = _(tagString).words(/DAMAGE \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's delay value if it exists.  Default value of 0 := arrive at start of fight.
    let unitDelay = _(tagString).words(/DELAY \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's time value if it exists.  Default value of...
    let unitTime = _(tagString).words(/TIME \d+/).words(/\d+/).map(x=>+x).value()[0] || undefined;
    // Get the carrier status flag if it exists.
    let unitCarrier = _(tagString).words(/CARRIER/).map(x=>_.isString(x)).value()[0] || false;

    let unit = {};

    unit.defense = unitDefense;
    unit.resist = unitResist;
    unit.flicker = unitFlicker;
    unit.break = unitBreak;
    unit.damage = unitDamage;

    unit.flags = {};
    unit.flags.carrier = unitCarrier;

    console.log(unit);

    return unit;
  };

  _service.parseBrackets = (bracketString) => {};

  return _service;
}

parser.$inject = [];

// Service Function Definitions Below
