import crits from './be_crits.txt';

export function library() {
  let _service = {};

  parseCrits();

  return _service;
}

library.$inject = [];

// Service Function Definitions Below
function parseCrits() {
  console.info(crits);
}
