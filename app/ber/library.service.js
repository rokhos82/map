import critsRaw from './be_crits.txt';
import critTablesRaw from "./be_critTables.txt";

export function library() {
  let _service = {};

  let _critTable = parseCrits();

  _service.getCritTableByName = (id) => {
    return _.cloneDeep(_critTable[id]);
  };

  _service.getCritTables = () => {
    return _.cloneDeep(_critTable);
  };

  return _service;
}

library.$inject = [];

// Service Function Definitions Below
function parseCrits() {
  let lines = _(critsRaw).split(/(\n|\r|\n\r|\r\n)/).filter((str) => { return (str === "\n" || str === "\r") ? null : str; }).map((str) => { return angular.fromJson(str); }).value();
  console.info(lines);
  let tables = angular.fromJson(critTablesRaw);
  _.forEach(lines,(line) => {
    let entry = {
      weight: line.weight,
      text: line.text
    };
    _.defaults(entry,line.effect);
    tables[line.table].push(entry);
  });

  // Convert weights to min/maxRoll values
  _.forEach(tables,(table) => {
    let roll = 0;
    _.forEach(table,(entry) => {
      let minRoll = roll + 1;
      let maxRoll = roll + entry.weight;
      entry.minRoll = minRoll;
      entry.maxRoll = maxRoll;
      roll += entry.weight;
    });
  });

  console.info(tables);

  return tables;
}
