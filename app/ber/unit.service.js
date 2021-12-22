export function unit() {
  let _service = {};

  _service.tagString = (unit) => {
    let tagString = "";

    _.forEach(unit.tags,(value,tag) => {
      if(tag !== "brackets" && tag !== "flags" && tag !== "scan" && tag !== "hull" && !!value) {
        tagString += `${tag} ${value} `;
      }
    });

    return tagString;
  }

  _service.attackString = (unit) => {
    let attackString = "";

    _.forEach(unit.brackets,(value) => {
      attackString += `${value.tag}`;
    });

    return attackString;
  }

  return _service;
}

unit.$inject = [];

// Service Function Definitions Below
