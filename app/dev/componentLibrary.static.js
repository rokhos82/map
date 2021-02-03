export const componentLibrary = {
  "baseHullStarship": {
    "id": "baseHullStarship",
    "label": "Base Hull (Starship)",
    "attributes": {},
    "channels": {
      "hitpoints": {
        "name": "hitpoints",
        "channels": {
          "armor": {
            "name": "armor",
            "attributes":{
              "magnitude": "<unit.size>"
            }
          }
        }
      }
    }
  },
  "structuralReinforcement": {
    "id": "structuralReinforcement",
    "label": "Structural Reinforcement",
    "channels": {
      "hitpoints": {
        "channels": {
          "armor": {
            "attributes": {
              "magnitude": 1
            }
          }
        }
      }
    }
  }
};
