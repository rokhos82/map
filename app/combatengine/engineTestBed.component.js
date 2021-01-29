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
    let baseHullComponent = {};

    this.unitRaw = {
      info: {},
      components: {
        "uuid1": {}
      }
    };
  }
}

engineTestBedController.$inject = ["$scope","unitCompilerService"];

export const engineTestBed = {
  bindings: {},
  controller: engineTestBedController,
  template: require('./engineTestBed.component.html')
};
