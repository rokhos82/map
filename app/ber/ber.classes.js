export class Unit {
  info = {}
  attributes = {}
  hash = ""
  states = {
    start: {
      actions: {
        onEnter: () => {
          // Setup tasks
        },
        onExit: () => {
          // Clean up tasks
        }
      },
      transitions: {
        next: () => {
          // Put state graph decision logic in here...
        }
      }
    },
    wait: {
      actions: {
        onEnter: () => {
          // Setup tasks
        },
        onExit: () => {
          // Clean up tasks
        }
      },
      transitions: {
        next: () => {
          // Put state graph decision logic in here...
        }
      }
    },
    combat: {
      actions: {
        onEnter: () => {
          // Setup tasks
        },
        onExit: () => {
          // Clean up tasks
        }
      },
      transitions: {
        next: () => {
          // Put state graph decision logic in here...
        }
      }
    },
    leave: {
      actions: {
        onEnter: () => {
          // Setup tasks
        },
        onExit: () => {
          // CLean up tasks
        }
      },
      transitions: {
        next: () => {
          // Put state graph decision logic in here...
        }
      }
    },
    death: {
      actions: {
        onEnter: () => {
          // Setup tasks
        },
        onExit: () => {
          // Clean up tasks
        }
      },
      transitions: {
        next: () => {
          // Put state graph decision logic in here...
        }
      }
    },
    end: {
      actions: {
        onEnter: () => {
          // Setup tasks
        },
        onExit: () => {
          // Clean up tasks
        }
      },
      transitions: {
        next: () => {
          // Put state graph decision logic in here...
        }
      }
    }
  }

  constructor(data) {
    // The constructor assumes that the simple parsed information from the parser
    // is being passed to it.
    this.info = {};
    this.attributes = {};
    this.hash = _.camelCase(this.info.name);
    this.state = "start";
  }

  getHash() {
    return this.hash;
  }
}

export class Fleet {
  constructor(data) {
    this.hash = _.camelCase(data.race + data.name);

    this.info = {
      name: data.name,
      race: data.race,
      faction: data.faction,
      enemies: data.enemies
    };

    this.units = {};
    this.unitHashList = [];

    _.forEach(data.units,(unit) => {
      unit.faction = this.faction;
      unit.hash = _.camelCase(this.hash + unit.name);
      this.units[unit.hash] = unit;
      this.unitHashList.push(unit.hash);
    });
  }

  setTargetList(list) {
    this.targets = _.cloneDeep(list);
  }
}

export class Faction {
  constructor(data) {
    this.info = {
      name: data.name,
      hash: ""
    };
    this.fleets = {};
  }
}

export class Turn {
  constructor(factions,units,turn) {
    this.turn = (turn + 1) || 1;
    this.events = [];
    this.units = units ? _.cloneDeep(units) : {};
    this.factions = _.cloneDeep(factions);
  }

  nextState() {
    // This function builds a new state object and returns it
    let next = new Turn(this.factions,this.units);
  }
}

export class Simulation {
  constructor(data) {
    this.factions = {};
    this.factions.attackers = new Faction(data.factions.attackers);
    this.factions.defenders = new Faction(data.factions.defenders);
    this.options = data.options;
    this.turns = [];

    // TASK: Build the target list for each faction.
    // First, build a list of names for each faction.  <== This is the unitHashList from the Fleet class
    // Second, save those name lists of each faction's enemies. <== Use the Fleet->setTargetList funciton
    _.forEach(this.factions,(faction) => {
      var list = [];
      _.forEach(faction.info.enemies,(enemy) => {
        list = _.concat(list,this.factions[enemy].unitHashList);
      });
      faction.targets = list;
    });
  }
}
