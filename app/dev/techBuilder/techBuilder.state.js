export const techBuilderState = {
  parent: "devRoot",
  name: "techBuilder",
  url: "/techbuilder",
  component: "techBuilderRoot",
  redirectTo: 'techBuilderList'
};

export const techBuilderListState = {
  parent: 'techBuilder',
  name: 'techBuilderList',
  url: '/list',
  component: 'techBuilderList'
};

export const techBuilderEditState = {
  parent: 'techBuilder',
  name: 'techBuilderEdit',
  url: '/edit',
  component: 'techBuilderEdit'
};
