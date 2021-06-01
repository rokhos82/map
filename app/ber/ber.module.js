/**
 * @namespace BER
 * @memberOf angular_module
 */

import {berRoot} from "./berRoot.component.js";
import {berWelcome} from "./berWelcome.component.js";
import {berImport} from "./berImport.component.js";
import {berFleetsView} from "./berFleetsView.component.js";

import {fleets} from "./fleet.service.js";
import {parser} from "./parser.service.js";

import {berRootState,berWelcomeState,berImportState,berFleetsViewState} from "./ber.states.js";

export const BER = angular.module("mobius-ber",["ui.router"]);

BER.config(["$uiRouterProvider",berModuleController]);

function berModuleController($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  // Setup the states that the Incident module will use
  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(berRootState);
  $stateRegistry.register(berWelcomeState);
  $stateRegistry.register(berImportState);
  $stateRegistry.register(berFleetsViewState);
}

BER.component('berRoot',berRoot);
BER.component('berWelcome',berWelcome);
BER.component('berImport',berImport);
BER.component('berFleetsView',berFleetsView);

BER.factory('berFleets',fleets);
BER.factory('berParser',parser);
