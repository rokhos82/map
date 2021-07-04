export class Unit {
  info = {}
  attributes = {}
  hash = {}
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
      faction: data.faction
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
}

export class Faction {
  constructor(data) {}
}

export class State {
  constructor(data) {}
}

export class Simulation {
  constructor(data) {
    this.factions = {};
    data.factions.attackers.faction = "attackers";
    data.factions.defenders.faction = "defenders";
    this.factions.attackers = new Fleet(data.factions.attackers);
    this.factions.defenders = new Fleet(data.factions.defenders);
  }
}
