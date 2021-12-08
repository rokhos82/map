export const berRootState = {
  parent: 'app',
  name: 'berRoot',
  url: '/ber',
  component: 'berRoot',
  redirectTo: 'berWelcome'
};

export const berWelcomeState = {
  parent: 'berRoot',
  name: 'berWelcome',
  url: '/welcome',
  component: 'berWelcome'
};

export const berImportState = {
  parent: 'berRoot',
  name: 'berImport',
  url: '/import',
  component: 'berImport'
};

export const berFleetsViewState = {
  parent: 'berRoot',
  name: 'berFleetsView',
  url: '/fleets',
  component: 'berFleetsView'
};

export const berFleetsViewDetailState = {
  parent: 'berFleetsView',
  name: 'berFleetsViewDetail',
  url: '/{uuid}',
  resolve: {
    fleet: ["berFleets","$stateParams",(fleetService,$stateParams) => {
      let fleet = fleetService.getFleet($stateParams.uuid);
      return fleet;
    }]
  },
  views: {
    '@^.^': "berFleetDetail"
  }
};

export const berSimulationState = {
  parent: 'berRoot',
  name: 'berSimulation',
  url: '/simulation',
  component: 'berSimulation'
};

export const berResultsState = {
  parent: 'berRoot',
  name: 'berResults',
  url: '/results',
  component: 'berResultView'
};
