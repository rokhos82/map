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
            "attributes": {
              "magnitude": "<unit.size>"
            }
          }
        }
      },
      "space": {
        "channels": {
          "ship": {
            "attributes": {
              "magnitude": "<unit.size>*<tech.pst.level>"
            },
            "name": "ship"
          }
        },
        "name": "space"
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
              "magnitude": "1"
            },
            "name": "armor"
          }
        },
        "name": "hitpoints"
      },
      "space": {
        "channels": {
          "ship": {
            "attributes": {
              "magnitude": "-1"
            },
            "name": "ship"
          }
        },
        "name": "space"
      }
    }
  }
};
