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
