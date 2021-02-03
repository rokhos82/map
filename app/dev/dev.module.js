/**
 * @namespace DEV_MODULE
 * @memberOf angular_module
 */

import {devRoot} from "./devRoot.component.js";
import {componentBuilder} from "./componentBuilder.component.js";
import {componentBuilderList} from "./componentBuilderList.component.js";
import {componentBuilderEdit} from "./componentBuilderEdit.component.js";
import {componentPart} from "./componentPart.component.js";

import {componentLibrary} from "./componentLibrary.service.js";

import {devRootState,devComponentBuilderState,devComponentBuilderListState,devComponentBuilderEditState} from "./dev.states.js";

export const DEV_MODULE = angular.module("mobius-dev",["mobius-core","ui.router"]);

DEV_MODULE.config(["$uiRouterProvider",devModuleController]);

function devModuleController($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  // Setup the states that the Incident module will use
  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(devRootState);
  $stateRegistry.register(devComponentBuilderState);
  $stateRegistry.register(devComponentBuilderListState);
  $stateRegistry.register(devComponentBuilderEditState);
}

DEV_MODULE.component("devRoot",devRoot);
DEV_MODULE.component("componentBuilder",componentBuilder);
DEV_MODULE.component("componentBuilderList",componentBuilderList);
DEV_MODULE.component("componentBuilderEdit",componentBuilderEdit);
DEV_MODULE.component("componentPart",componentPart);

DEV_MODULE.factory("componentLibrary",componentLibrary);
