export const components = {
  "baseHullStarship": {
    "id": "baseHullStarship",
    "label": "Base Hull (Starship)",
    "attributes": [
      "channels:hitpoints:armor:magnitude=<unit.size>", // => { channels: { hitpoints: { armor: { magnitude: "<unit.size>" }}}}
      "channels:space:ship:magnitude=<unit.size>*<tech.powerSystemsTech.space.starship>", // => { channels: { space: { ship: { magnitude: "<unit.size>*<tech.powerSystemsTech.space.starship>" }}}}
      "channels:power:ship:magnitude=<unit.size>*<tech.powerSystemsTech.power.starship>" // => { channels: { power: { ship: { magnitude: "<unit.size>*<tech.powerSystemsTech.power.starship>"}}}}
    ]
  },
  "baseHullGunboat": {
    "id": "baseHullGunboat",
    "label": "Base Hull (Gunboat)",
    "attributes": [
      "channels:hitpoints:armor:magnitude=<unit.size>",
      "channels:space:ship:magnitude=<unit.size>*<tech.powerSystemsTech.space.gunboat>",
      "channels:power:ship:magnitude=<unit.size>*<tech.powerSystemsTech.power.gunboat>"
    ]
  },
  "baseHullFighter": {
    "id": "baseHullFighter",
    "label": "Base Hull (Fighter)",
    "attributes": []
  },
  "baseHullBase": {
    "id": "baseHullBase",
    "label": "Base Hull (Base)",
    "attributes": []
  },
  "structuralReinforcement": {
    "id": "structuralReinforcement",
    "label": "Structural Reinforcement",
    "attributes": []
  },
  "shieldEmitter": {
    "id": "shieldEmitter",
    "label": "Shield Emitter",
    "attributes": [
      "channels:hitpoints:shield:magnitude=<tech.shieldEmitter.pointPer>",
      "channels:space:ship:magnitude=<tech.shieldEmitter.spacePer>",
      "channels:power:ship:magnitude=<tech.shieldEmitter.powerPer>"
    ]
  },
  "beamEmitter": {
    "id": "beamEmitter",
    "label": "Beam Emitter",
    "attributes": [
      "verbs:"
    ]
  },
  "missileLauncher": {
    "id": "missileLauncher",
    "label": "Missile Launcher",
    "attributes": [],
    "effects": [],
    "verbs": []
  },
  "stl": {
    "id": "stl",
    "label": "Slow Than Light (STL)",
    "attributes": [
      "channels:space:ship:amplifier=0.25",
      "channels:cost:ship:amplifier=-0.25"
    ],
    "effects": [],
    "verbs": []
  }
};
