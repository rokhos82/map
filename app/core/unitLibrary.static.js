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
      "tech:powerSystemsTech:gen=2" // => {tech: { powerSystemsTech: { gen: 2 }}}
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
