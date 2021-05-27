/**
 * @namespace BER
 * @memberOf angular_module
 */

import {berRoot} from "./berRoot.component.js";

import {berRootState} from "./ber.states.js";

export const BER = angular.module("mobius-ber",["ui.router"]);

BER.config(["$uiRouterProvider",berModuleController]);

function berModuleController($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  // Setup the states that the Incident module will use
  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(berRootState);
}

BER.component('berRoot',berRoot);
