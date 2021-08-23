export function parser() {
  let _service = {};

  _service.parseFleet = (fleetString) => {
    // Get the first line: fleet info
    // RACE, FLEET, BREAK, # UNITS, TOTAL HULL, TARGET, ##, ##, ##
    // All subsequent lines are units

    // Break the fleet string by new line character
    //console.log(fleetString);
    let lines = _(fleetString).split(/(\n|\r|\n\r|\r\n)/).filter((str) => { return str === "\n" ? null : str; }).value();
    //console.log(lines);

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
      let unit = _service.parseUnit(lines[i]);
      if(!unit.tags.break) {
        unit.tags.break = fleet.break;
      }
      units.push(unit);
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
    //console.log(unitInfo);

    unit.name = unitInfo[0];
    unit.bmMax = +unitInfo[1];
    unit.bmCur = +unitInfo[2];
    unit.shMax = +unitInfo[3];
    unit.shCur = +unitInfo[4];
    unit.tpMax = +unitInfo[5];
    unit.tpCur = +unitInfo[6];
    unit.hlMax = +unitInfo[7];
    unit.hlCur = +unitInfo[8];

    let tags = unitInfo[12];

    unit.tags = _service.parseTags(tags);

    //console.log(unit);

    return unit;
  };

  _service.parseTags = (tagString) => {
    // Repeatedly strip the first substring out; analyze it; consume more depending on the tag; end when string is empty.
    // Could I modularize this using a pair of TAG and mapFunction for each tag in a UDL?  I would need a default value too.
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
    let unitBreak = _(tagString).words(/BREAK \d+/).words(/\d+/).map(x=>+x).value()[0] || undefined;
    // Get the unit's damage value if it exists.  Default value of 0 := fights to the death.
    let unitDamage = _(tagString).words(/DAMAGE \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's delay value if it exists.  Default value of 0 := arrive at start of fight.
    let unitDelay = _(tagString).words(/DELAY \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the unit's time value if it exists.  Default value of...
    let unitTime = _(tagString).words(/TIME \d+/).words(/\d+/).map(x=>+x).value()[0] || undefined;
    // Get the unit's datalink group if it exits.
    let unitDL = _(tagString).words(/DL \w+/).words(/\w+$/).value()[0] || undefined;
    // Get the carrier status flag if it exists.
    let unitCarrier = _(tagString).words(/CARRIER/).map(x=>_.isString(x)).value()[0] || false;
    // Get the unit's reserve value if it exists.
    let unitReserve = _(tagString).words(/RESERVE \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the NOMOVE status flag if it exists.
    let unitNoMove = _(tagString).words(/NOMOVE/).map(x=>_.isString(x)).value()[0] || false;
    // Get the PD value if it exists.
    let unitPD = _(tagString).words(/PD \d+/).words(/\d+/).map(x=>+x).value()[0] || undefined;
    // Get the HULL values if they exist.
    let unitHULLvalues = _(tagString).words(/HULL \d+ \d+/).words(/\d+/g).map(x=>+x).value() || [];
    // Get the SCAN values if they exist.
    let unitSCANvalues = _(tagString).words(/SCAN \d+ \d+/).words(/\d+/g).map(x=>+x).value() || [];
    // Get the AR values if they exist.
    let unitAR = _(tagString).words(/AR \d+/).words(/\d+/).map(x=>+x).value()[0] || false;
    // Get the SR values if they exist.
    let unitSR = _(tagString).words(/SR \d+/).words(/\d+/).map(x=>+x).value()[0] || false;
    // Get the FIGHTER status tag if it exists.
    let unitFighter = _(tagString).words(/FIGHTER/).map(x=>_.isString(x)).value()[0] || false;
    // Get the FLEE status tag if it exists.
    let unitFlee = _(tagString).words(/FLEE/).map(x=>_.isString(x)).value()[0] || false;

    let tags = {};

    tags.defense = unitDefense;
    tags.resist = unitResist;
    tags.flicker = unitFlicker;
    tags.break = unitBreak;
    tags.damage = unitDamage;
    tags.delay = unitDelay;
    tags.time = unitTime;
    tags.dl = unitDL;
    tags.reserve = unitReserve;
    tags.nomove = unitNoMove;
    tags.pd = unitPD;
    tags.ar = unitAR;
    tags.sr = unitSR;
    tags.fighter = unitFighter;
    tags.flee = unitFlee;

    tags.hull = {
      base: unitHULLvalues[0] || false,
      range: unitHULLvalues[1] || false
    };
    if(_.isNumber(tags.hull.base) && _.isNumber(tags.hull.range)) {
      tags.hull.lower = tags.hull.base - tags.hull.range;
      tags.hull.upper = tags.hull.base + tags.hull.range;
    }

    tags.scan = {
      base: unitSCANvalues[0] || false,
      range: unitSCANvalues[1] || false
    };
    if(_.isNumber(tags.scan.base) && _.isNumber(tags.scan.range)) {
      tags.scan.lower = tags.scan.base - tags.scan.range;
      tags.scan.upper = tags.scan.base + tags.scan.range;
    }

    tags.flags = {};
    tags.flags.carrier = unitCarrier;

    tags.brackets = _.map(brackets,_service.parseBrackets);

    //console.log(tags);

    return tags;
  };

  _service.parseBrackets = (bracketString) => {
    // Braket format: [VOLLEY tags]
    // The first value is always the size of the VOLLEY
    let volley = _(bracketString).words(/^\[\d+/).words(/\d+/).map(x=>+x).value()[0];
    // if there is a multi tag it is always next
    let multi = _(bracketString).words(/multi \d+/).words(/\d+/).map(x=>+x).value()[0];
    // also look for the missile tag
    let missile = _(bracketString).words(/mis(?<bm>.)(?<sh>.)(?<tp>.)(?<hl>.)/).value().groups;
    // Now look for the other tags
    let target = _(bracketString).words(/target \d+/).words(/\d+/).map(x=>+x).value()[0];
    let yld = _(bracketString).words(/yield \d+/).words(/\d+/).map(x=>+x).value()[0] || 0;
    // Get the ammo/shots tag
    let ammo = _(bracketString).words(/(ammo|shots) \d+/).words(/\d+/).map(x=>+x).value()[0] || undefined;
    // Get the boolean flags
    let long = _(bracketString).words(/long/).map(x=>_.isString(x)).value()[0] || false;
    let artillery = _(bracketString).words(/artillery/).map(x=>_.isString(x)).value()[0] || false;
    let glbl = _(bracketString).words(/global/).map(x=>_.isString(x)).value()[0] || false;
    let offline = _(bracketString).words(/offline/g).map(x=>_.isString(x)).value().length || 0;

    let bracket = {};
    bracket.volley = volley;
    bracket.multi = multi;
    bracket.missile = missile;
    bracket.target = target;
    bracket.yield = yld;
    bracket.long = long;
    bracket.artillery = artillery;
    bracket.global = glbl;
    bracket.ammo = ammo;
    bracket.offline = offline;

    //console.log(bracket);
    return bracket;
  };

  return _service;
}

parser.$inject = [];

// Service Function Definitions Below
