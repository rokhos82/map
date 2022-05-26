/**
 * @namespace BER
 * @memberOf angular_module
 */

import {berRoot} from "./berRoot.component.js";
import {berWelcome} from "./berWelcome.component.js";
import {berImport} from "./berImport.component.js";
import {berFleetsView} from "./berFleetsView.component.js";
import {berSimulation} from "./berSimulation.component.js";
import {berSimulationControl} from "./berSimulationControl.component.js";
import {berResultView} from "./berResultView.component.js";

import {berFleetsRoot} from "./fleets/berFleetsRoot.component.js";
import {berFleetList} from "./fleets/berFleetList.component.js";
import {berFleetsImport} from "./fleets/berFleetsImport.component.js";
import {berFleetInfo} from "./berFleetInfo.component.js";
import {berFleetCard} from "./fleets/berFleetCard.component.js";
import {berFleetDetail} from "./fleets/berFleetDetail.component.js";
import {berFleetInfoList} from "./fleets/berFleetInfoList.component.js";
import {berFleetInfoLine} from "./fleets/berFleetInfoLine.component.js";

import {berSimulatorRoot} from "./simulator/berSimulatorRoot.component.js";
import {berSimulatorList} from "./simulator/berSimulatorList.component.js";
import {berSimulatorView} from "./simulator/berSimulatorView.component.js";
import {berSimulatorCreate} from "./simulator/berSimulatorCreate.component.js";
import {berSimulatorResultsView} from "./simulator/berSimulatorResultsView.component.js";
import {berSimulatorResultsUnitDetail} from "./simulator/berSimulatorResultsUnitDetail.component.js";
import {berSimulatorResultsExportTxt} from "./simulator/berSimulatorResultsExportTxt.component.js";

import {unit} from "./unit.service.js";
import {fleets} from "./fleet.service.js";
import {parser} from "./parser.service.js";
import {simulator} from "./ber.simulator.js";
import {simulator2} from "./ber.simulator2.js";
import {state} from "./state.service.js";
import {archive} from "./archive.service.js";
import {library} from "./library.service.js";

//import {berRootState,berWelcomeState,berImportState,berFleetsViewState,berFleetsViewDetailState,berSimulationState,berResultsState} from "./ber.states.js";
import {
  berRootState,
  berWelcomeState,
  berFleetsRootState,berFleetsListState,berFleetsImportState,berFleetsDetailState,
  berSimulatorRootState,berSimulatorListState,berSimulatorViewState,berSimulatorCreateState,berSimulatorFleetDetailState,berSimulatorResultsViewState,berSimulatorResultsUnitDetailState,berSimulatorResultsExportTxtState
} from "./ber.states.js";

export const BER = angular.module("mobius-ber",["ui.router"]);

BER.config(["$uiRouterProvider",berModuleController]);

function berModuleController($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  // Setup the states that the Incident module will use
  const $stateRegistry = $uiRouter.stateRegistry;
  /*$stateRegistry.register(berRootState);
  $stateRegistry.register(berWelcomeState);
  $stateRegistry.register(berImportState);
  $stateRegistry.register(berFleetsViewState);
  $stateRegistry.register(berSimulationState);
  $stateRegistry.register(berResultsState);
  $stateRegistry.register(berFleetsViewDetailState);//*/

  $stateRegistry.register(berRootState);
  $stateRegistry.register(berWelcomeState);
  $stateRegistry.register(berFleetsRootState);
  $stateRegistry.register(berFleetsListState);
  //$stateRegistry.register(berFleetsViewState);
  $stateRegistry.register(berFleetsImportState);
  $stateRegistry.register(berFleetsDetailState);

  $stateRegistry.register(berSimulatorRootState);
  $stateRegistry.register(berSimulatorListState);
  $stateRegistry.register(berSimulatorViewState);
  $stateRegistry.register(berSimulatorCreateState);
  $stateRegistry.register(berSimulatorFleetDetailState);
  $stateRegistry.register(berSimulatorResultsViewState);
  $stateRegistry.register(berSimulatorResultsUnitDetailState);
  $stateRegistry.register(berSimulatorResultsExportTxtState);
}

BER.component('berRoot',berRoot);
BER.component('berWelcome',berWelcome);
BER.component('berImport',berImport);
BER.component('berFleetsView',berFleetsView);
BER.component('berSimulation',berSimulation);
BER.component('berSimulationControl',berSimulationControl);
BER.component('berResultView',berResultView);

BER.component('berFleetsRoot',berFleetsRoot);
BER.component('berFleetList',berFleetList);
BER.component('berFleetsImport',berFleetsImport);
BER.component('berFleetInfo',berFleetInfo);
BER.component('berFleetCard',berFleetCard);
BER.component('berFleetDetail',berFleetDetail);
BER.component('berFleetInfoLine',berFleetInfoLine);
BER.component('berFleetInfoList',berFleetInfoList);

BER.component('berSimulatorRoot',berSimulatorRoot);
BER.component('berSimulatorList',berSimulatorList);
BER.component('berSimulatorView',berSimulatorView);
BER.component('berSimulatorCreate',berSimulatorCreate);
BER.component('berSimulatorResultsView',berSimulatorResultsView);
BER.component('berSimulatorResultsUnitDetail',berSimulatorResultsUnitDetail);
BER.component('berSimulatorResultsExportTxt',berSimulatorResultsExportTxt);

BER.factory('berUnit',unit);
BER.factory('berFleets',fleets);
BER.factory('berParser',parser);
BER.factory('berSimulator',simulator);
BER.factory('berSimulator2',simulator2);
BER.factory('berState',state);
BER.factory('berArchive',archive);
BER.factory('berLibrary',library);
