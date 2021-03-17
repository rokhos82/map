/**
 * @namespace mobius-engine
 */

import mapCss from "./engine.layout.css";
import {engineRoot} from "./engineRoot.component.js";
import {teamsManagement} from "./teamsManagement.component.js";
import {engineWelcome} from "./engineWelcome.component.js";
import {engineTestBed} from "./engineTestBed.component.js";

import {unitCompilerService} from "./compiler.service.js";
import {engineServiceFactory} from "./engine.service.js";

import {engineRootState,engineTeamState,engineWelcomeState,engineTestState} from "./engine.states.js";

export const ENGINE_MODULE = angular.module('mobius-engine',['mobius-core','ui.router','ui.bootstrap']);

ENGINE_MODULE.config(['$uiRouterProvider',engineConfigCallback]);

function engineConfigCallback($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(engineRootState);
  $stateRegistry.register(engineTeamState);
  $stateRegistry.register(engineWelcomeState);
  $stateRegistry.register(engineTestState);
}

ENGINE_MODULE.component('engineRoot',engineRoot);
ENGINE_MODULE.component('teamsManagement',teamsManagement);
ENGINE_MODULE.component('engineWelcome',engineWelcome);
ENGINE_MODULE.component('engineTestBed',engineTestBed);

ENGINE_MODULE.factory('unitCompilerService',unitCompilerService);
ENGINE_MODULE.factory("mobius-engine-service",engineServiceFactory);
