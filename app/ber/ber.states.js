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

/*export const berFleetsViewState = {
  parent: 'berRoot',
  name: 'berFleetsView',
  url: '/fleets',
  component: 'berFleetsView'
};//*/

export const berFleetsViewDetailState = {
  parent: 'berFleetsView',
  name: 'berFleetsViewDetail',
  url: '/{uuid}',
  resolve: {
    fleet: ["berArchive","$stateParams",(archive,$stateParams) => {
      let fleet = archive.getFleet($stateParams.uuid);
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

// New State Definitions -------------------------------------------------------
export const berFleetsRootState = {
  name: 'berRoot.fleets',
  url: '/fleets',
  component: 'berFleetsRoot',
  redirectTo: 'berRoot.fleets.view'
};

export const berFleetsViewState = {
  name: 'berRoot.fleets.view',
  url: '/view',
  component: 'berFleetsView',
};

export const berFleetsDetailState = {
  name: 'berRoot.fleets.view.detail',
  url: '/{uuid}',
  resolve: {
    fleet: ["berArchive","$stateParams",(archive,$stateParams) => {
      let fleet = archive.getFleet($stateParams.uuid);
      return fleet;
    }]
  },
  views: {
    '@^.^': 'berFleetDetail'
  }
};

export const berFleetsImportState = {
  name: 'berRoot.fleets.import',
  url: '/import',
  component: 'berFleetsImport'
};
