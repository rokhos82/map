import {techBuilderRoot} from "./techBuilderRoot.component.js";

import {techBuilderState} from "./techBuilder.state.js";

export const TECHBUILDER_MODULE = angular.module("mobius-tech-builder",["mobius-core"]);

TECHBUILDER_MODULE.config(["$uiRouterProvider",techBuilderModuleController]);

function techBuilderModuleController($uiRouter) {
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(techBuilderState);
}

TECHBUILDER_MODULE.component("techBuilderRoot",techBuilderRoot);
