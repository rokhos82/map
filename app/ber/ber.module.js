/**
 * @namespace BER
 * @memberOf angular_module
 */

import {berRoot} from "./berRoot.component.js";
import {berWelcome} from "./berWelcome.component.js";
import {berImport} from "./berImport.component.js";
import {berFleetsView} from "./berFleetsView.component.js";
import {berSimulation} from "./berSimulation.component.js";

import {fleets} from "./fleet.service.js";
import {parser} from "./parser.service.js";
import {simulator} from "./ber.simulator.js";
import {state} from "./state.service.js";

import {berRootState,berWelcomeState,berImportState,berFleetsViewState,berSimulationState} from "./ber.states.js";

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
  $stateRegistry.register(berSimulationState);
}

BER.component('berRoot',berRoot);
BER.component('berWelcome',berWelcome);
BER.component('berImport',berImport);
BER.component('berFleetsView',berFleetsView);
BER.component('berSimulation',berSimulation);

BER.factory('berFleets',fleets);
BER.factory('berParser',parser);
BER.factory('berSimulator',simulator);
BER.factory('berState',state);
