/**
 * @namespace mobius-engine
 */

import mapCss from "./engine.layout.css";
import {engineRoot} from "./engineRoot.component.js";
import {teamsManagement} from "./teamsManagement.component.js";
import {engineWelcome} from "./engineWelcome.component.js";

import {engineRootState,engineTeamState,engineWelcomeState} from "./engine.states.js";

export const ENGINE_MODULE = angular.module('mobius-engine',['mobius-core','ui.router','ui.bootstrap']);

ENGINE_MODULE.config(['$uiRouterProvider',engineConfigCallback]);

function engineConfigCallback($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(engineRootState);
  $stateRegistry.register(engineTeamState);
  $stateRegistry.register(engineWelcomeState);
}

ENGINE_MODULE.component('engineRoot',engineRoot);
ENGINE_MODULE.component('teamsManagement',teamsManagement);
ENGINE_MODULE.component('engineWelcome',engineWelcome);
