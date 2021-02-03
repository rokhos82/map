/**
 * @class mobius-dev.componentBuilderEdit
 * @memberOf mobius-dev
 * @desc The edit view of the component model
 */
class componentBuilderEditController {
  constructor($scope,componentLibrary) {
    this.$scope = $scope;
    this.library = componentLibrary;
  }

  $onInit() {
    this.component = this.library.getComponent(this.componentId);
  }

  onNewAttribute(newAttributeString) {
    let newAttributeObject = this.library.parseAttribute(newAttributeString);
    _.merge(this.component,newAttributeObject);
    //this.onUpdate(this.component.id,this.component);
  }

  updateComponent() {
    this.onUpdate(this.component.id,this.component);
  }
}

componentBuilderEditController.$inject = ["$scope","componentLibrary"];

export const componentBuilderEdit = {
  bindings: {
    componentId: "<",
    onUpdate: "<"
  },
  controller: componentBuilderEditController,
  template: require('./componentBuilderEdit.component.html')
};
