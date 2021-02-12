export const unitBuilderState = {
  parent: "devRoot",
  name: "unitBuilder",
  url: "/unitbuilder",
  component: "unitBuilderRoot",
  redirectTo: "unitBuilderList"
};

export const unitBuilderListState = {
  parent: "unitBuilder",
  name: "unitBuilderList",
  url: "/list",
  component: "unitBuilderList"
};

export const unitBuilderEditState = {
  parent: "unitBuilder",
  name: "unitBuilderEdit",
  url: "/edit/{unitId}",
  component: "unitBuilderEdit",
  resolve: {
    unit: unitIdResolver
  }
};

unitIdResolver.$inject = ["$stateParams","mobius-core-unit-library"];
function unitIdResolver($stateParams,unitLibrary) {
  return unitLibrary.getUnit($stateParams.unitId);
}
