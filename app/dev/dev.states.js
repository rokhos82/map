export const devRootState = {
  parent: "app",
  name: "devRoot",
  url: "/dev",
  component: "devRoot",
};

export const devComponentBuilderState = {
  parent: "devRoot",
  name: "devComponentBuilder",
  url: "/component",
  component: "componentBuilder",
  redirectTo: "devComponentBuilderList"
};

export const devComponentBuilderListState = {
  parent: "devComponentBuilder",
  name: "devComponentBuilderList",
  url: "/list",
  component: "componentBuilderList"
};

export const devComponentBuilderEditState = {
  parent: "devComponentBuilder",
  name: "devComponentBuilderEdit",
  url: "/edit/{componentId}",
  component: "componentBuilderEdit",
  resolve: {
    componentId: componentIdResolver,
    onUpdate: componentUpdateResolver
  }
};

componentIdResolver.$inject = ["$stateParams"];
function componentIdResolver($stateParams) {
  return $stateParams.componentId;
}

componentUpdateResolver.$inject = ["componentLibrary"];
function componentUpdateResolver(library) {
  return library.setComponent;
}
