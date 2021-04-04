/**
 * @class engine-mobule.engineTestBed
 * @memberOf engine-mobule
 * @desc Test bed for features before building them out completely
 */
class engineTestBedController {
  constructor($scope,compiler) {
    this.$scope = $scope;
    this.compiler = compiler;
  }

  $onInit() {
    this.unit = {
      "uuid": "7e17e9c6-72c7-4796-b5b7-d659c95b3bfe",
      "name": "Heavy Beam Frigate",
      "type": "starship",
      "size": 6,
      "raw": [
        "component:starshipBaseHull(size=6)",
        "component:ablativeArmor(multiplier=0.5)",
        "component:forceCurtain(rating=10)",
        "battery:main:quantity=4",
        "battery:main:beamEmitter(rating=1,class=2)"
      ],
      "components": [],
      "channels": {
        "hitpoints": {
          "channels": {
            "hull": {
              "pool": 6
            },
            "armor": {
              "pool": 3
            },
            "shield": {
              "pool": 10
            }
          },
          "priority": ["shield","armor","hull"]
        }
      },
      "effects": [],
      "verbs": {
        "main": {
          "type": "attack",
          "attack": {
            "effects": {
              "damage": {
                "volley": 4,
                "quantity": 10,
                "target": 70,
                "yield": 20,
                "long": true,
                "channels": ["hitpoints:shield","hitpoints:armor","hitpoints:hull"]
              }
            }
          }
        }
      },
      "applied": []
    };
  }
}

engineTestBedController.$inject = ["$scope","unitCompilerService"];

export const engineTestBed = {
  bindings: {},
  controller: engineTestBedController,
  template: require('./engineTestBed.component.html')
};
