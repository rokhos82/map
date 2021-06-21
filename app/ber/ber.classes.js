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
          // Put state graph decision login in here...
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
      transitions: {}
    },
    leave: {
      actions: {},
      transitions: {}
    },
    end: {
      actions: {},
      transitions: {}
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

export class Fleet {}

export class Faction {}

export class State {}

export class Simulation {}
