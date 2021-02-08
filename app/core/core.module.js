/**
 * @namespace mobius-core
 */

import {lcgService} from './lcg.service.js';
import {uuidService} from './uuid.service.js';
import {unitLibrary} from "./unitLibrary.service.js";

export const CORE_MODULE = angular.module('mobius-core',["ui.router"]);

CORE_MODULE.config(['$uiRouterProvider',coreConfigCallback]);

function coreConfigCallback($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $stateRegistry = $uiRouter.stateRegistry;
}

CORE_MODULE.factory('mobius-core-lcg',lcgService);
CORE_MODULE.factory('mobius-core-uuid',uuidService);
CORE_MODULE.factory('mobius-core-unit-library',unitLibrary);
