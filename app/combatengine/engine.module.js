/**
 * @namespace mobius-engine
 */

import mapCss from "./engine.layout.css";
import {engineRoot} from "./engineRoot.component.js";
import {teamsManagement} from "./teamsManagement.component.js";

import {engineRootState,engineTeamState} from "./engine.states.js";

export const ENGINE_MODULE = angular.module('mobius-engine',['mobius-core','ui.router','ui.bootstrap']);

ENGINE_MODULE.config(['$uiRouterProvider',engineConfigCallback]);

function engineConfigCallback($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(engineRootState);
  $stateRegistry.register(engineTeamState);
}

ENGINE_MODULE.component('engineRoot',engineRoot);
ENGINE_MODULE.component('teamsManagement',teamsManagement);
