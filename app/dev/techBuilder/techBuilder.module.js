import {techBuilderRoot} from "./techBuilderRoot.component.js";
import {techBuilderEdit} from "./techBuilderEdit.component.js";
import {techBuilderList} from "./techBuilderList.component.js";

import {techBuilderState,techBuilderListState,techBuilderEditState} from "./techBuilder.state.js";

export const TECHBUILDER_MODULE = angular.module("mobius-tech-builder",["mobius-core"]);

TECHBUILDER_MODULE.config(["$uiRouterProvider",techBuilderModuleController]);

function techBuilderModuleController($uiRouter) {
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(techBuilderState);
  $stateRegistry.register(techBuilderEditState);
  $stateRegistry.register(techBuilderListState);
}

TECHBUILDER_MODULE.component("techBuilderRoot",techBuilderRoot);
TECHBUILDER_MODULE.component("techBuilderEdit",techBuilderEdit);
TECHBUILDER_MODULE.component("techBuilderList",techBuilderList);
