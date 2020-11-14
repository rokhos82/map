/**
 * This is the parent state for the entire application
 */



export const appState = {
  name: 'app',
  redirectTo: 'welcome',
  component: 'app'
};

export const welcomeState = {
  parent: 'app',
  name: 'welcome',
  url: '/welcome',
  component: 'welcome'
};
