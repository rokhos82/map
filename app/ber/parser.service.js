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
    let defense = _(tagString).words(/DEFENSE \d+/g).value();
    console.log(brackets,defense);
  };

  return _service;
}

parser.$inject = [];

// Service Function Definitions Below
