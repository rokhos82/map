export const engineRootState = {
  parent: 'app',
  name: 'engineRoot',
  url: '/engine',
  component: 'engineRoot',
  redirectTo: 'engineWelcomeState'
};

export const engineTeamState = {
  parent: 'engineRoot',
  name: 'engineTeamsManagement',
  url: '/teams',
  component: 'teamsManagement'
};

export const engineWelcomeState = {
  parent: 'engineRoot',
  name: 'engineWelcomeState',
  url: '/welcome',
  component: 'engineWelcome'
};

export const engineTestState = {
  parent: 'engineRoot',
  name: 'engineTestState',
  url: '/test',
  component: 'engineTestBed'
};
