export const components = {
  "baseHullStarship": {
    "id": "baseHullStarship",
    "label": "Base Hull (Starship)",
    "attributes": [
      "channels:hitpoints:armor:magnitude=<unit.size>",
      "channels:space:ship:magnitude=<unit.size>*<tech.pst.level.space>",
      "channels:power:ship:magnitude=<unit.size>*<tech.pst.level.power>"
    ]
  },
  "structuralReinforcement": {
    "id": "structuralReinforcement",
    "label": "Structural Reinforcement",
    "attributes": []
  }
};
