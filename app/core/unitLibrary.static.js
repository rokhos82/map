export const units = {
  "test001": {
    "id": "test001",
    "info": {
      "name": "UNS Flying Dutchman",
      "type": "Starship",
      "size": 6
    },
    "components": [
      "component:baseHullStarship()",
      "battery:0:weapon:beamEmitter({\"rating\":1,\"size\":0.5,\"rof\":1,\"caliber\":1})",
      "battery:0:weapon:quantity=4"
    ],
    "techs": [
      "tech:powerSystemsTech({level:3})" // => {tech: { powerSystemsTech: { level: 2 }}}
    ],
    "effects": [
      "effect:crew:grade=pirate"
    ]
  },
  "test002": {
    "id": "test002",
    "info": {
      "name": "NCC-1701-D Enterprise",
      "type": "Starship",
      "size": 12
    },
    "components": [],
    "techs": [],
    "effects": []
  }
};
