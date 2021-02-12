import {unitBuilderRoot} from "./unitBuilderRoot.component.js";
import {unitBuilderList} from "./unitBuilderList.component.js";
import {unitBuilderEdit} from "./unitBuilderEdit.component.js";

import {unitBuilderState,unitBuilderListState,unitBuilderEditState} from "./unitBuilder.state.js";

export const UNITBUILDER_MODULE = angular.module("mobius-unit-builder",["mobius-core"]);

UNITBUILDER_MODULE.config(["$uiRouterProvider",unitBuilderModuleController]);

function unitBuilderModuleController($uiRouter) {
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(unitBuilderState);
  $stateRegistry.register(unitBuilderListState);
  $stateRegistry.register(unitBuilderEditState);
}

UNITBUILDER_MODULE.component("unitBuilderRoot",unitBuilderRoot);
UNITBUILDER_MODULE.component("unitBuilderList",unitBuilderList);
UNITBUILDER_MODULE.component("unitBuilderEdit",unitBuilderEdit);
