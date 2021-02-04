/**
 * @class mobius-dev.componentBuilderEdit
 * @memberOf mobius-dev
 * @desc The edit view of the component model
 */
class componentBuilderEditController {
  constructor($scope,componentLibrary) {
    this.$scope = $scope;
    this.library = componentLibrary;
    this.messages = [];
  }

  $onInit() {
    this.component = this.library.getComponent(this.componentId);
  }

  onNewAttribute(newAttributeString) {
    let response = this.library.appendAttribute(this.componentId,newAttributeString);
    if(_.has(response,"error")) {
      this.messages.push({
        type: "danger",
        message: response.error
      });
    } else {
      // There is no error, update the object and clear the attribute field
      this.$scope.newAttribute = "";
    }
  }

  updateComponent() {
    this.onUpdate(this.component.id,this.component);
  }

  closeAlert(index) {
    this.messages.splice(index,1);
  }

  deleteAttribute(index) {
    // @TODO: Need to add a confirmation to this
    let attr = this.component.attributes.splice(index,1);
    this.messages.push({
      type: "warning",
      message: `Successfully deleted: ${attr[0]}`,
      timeout: 2000
    });
  }

  updateAttribute(index,value) {
    this.component.attributes[index] = value;
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
