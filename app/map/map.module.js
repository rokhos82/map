/**
 * @namespace mobius-map
 */
import mapCss from "./map.layout.css";
import {mapRoot} from "./mapRoot.component.js";

import {mapRootState} from "./map.states.js";

export const MAP_MODULE = angular.module('mobius-map',["ui.router","ui.bootstrap"]);

MAP_MODULE.config(['$uiRouterProvider',mapConfigCallback]);

function mapConfigCallback($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(mapRootState);
}

MAP_MODULE.component('mapRoot',mapRoot);
