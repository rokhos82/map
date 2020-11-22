/**
 * @namespace mobius-map
 */
import mapCss from "./map.layout.css";
import {mapRoot} from "./mapRoot.component.js";
import {mapgenService} from "./mapgen.service.js";
import {mapgenObjects} from "./mapgen.objects.js";
import {mapgenTables} from "./mapgen.tables.js";
import {mapgenFots} from "./mapgen.fots.js";

import {mapRootState} from "./map.states.js";

export const MAP_MODULE = angular.module('mobius-map',["ui.router","ui.bootstrap","mobius-core"]);

MAP_MODULE.config(['$uiRouterProvider',mapConfigCallback]);

function mapConfigCallback($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(mapRootState);
}

MAP_MODULE.component('mapRoot',mapRoot);
MAP_MODULE.component('mapgenFots',mapgenFots);

MAP_MODULE.factory('mapgenService',mapgenService);
MAP_MODULE.factory('mapgenObjects',mapgenObjects);
MAP_MODULE.factory('mapgenTables',mapgenTables);
