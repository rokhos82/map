/**
 * @namespace mobius-main
 */
import {app} from "./app.component.js";
import {welcome} from "./welcome.component.js";

import {appState,welcomeState} from "./app.states.js";

export const MAIN_MODULE = angular.module('mobius-main',["ui.router","ui.bootstrap","ngResource","mobius-core","mobius-map","mobius-engine","mobius-dev"]);

MAIN_MODULE.config(['$uiRouterProvider',function($uiRouter) {
  // Enable tracing of each TRANSITION... (check the javascript console)
  $uiRouter.trace.enable("TRANSITION");

  const $urlService = $uiRouter.urlService;
  $urlService.rules.otherwise({state:'app'});

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register(appState);
  $stateRegistry.register(welcomeState);
}]);

MAIN_MODULE.component('app',app);
MAIN_MODULE.component('welcome',welcome);
