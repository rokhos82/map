import {unitBuilderRoot} from "./unitBuilderRoot.component.js";

import {unitBuilderState,unitBuilderListState} from "./unitBuilder.state.js";

export const UNITBUILDER_MODULE = angular.module("mobius-unit-builder",["mobius-core"]);

UNITBUILDER_MODULE.config(["$uiRouterProvider",unitBuilderModuleController]);

function unitBuilderModuleController($uiRouter) {
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(unitBuilderState);
  $stateRegistry.register(unitBuilderListState);
}

UNITBUILDER_MODULE.component("unitBuilderRoot",unitBuilderRoot);
