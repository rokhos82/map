export const units = {
  "test001": {
    "id": "test001",
    "info": {
      "name": "UNS Flying Dutchman",
      "type": "Starship",
      "size": 6
    },
    "components": [
      "component:baseHullStarship()"
    ],
    "techs": [
      "tech:powerSystemsTech:level=3" // => {tech: { powerSystemsTech: { level: 2 }}}
    ],
    "effects": []
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
