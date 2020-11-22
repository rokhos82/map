function fotsMapController(mapgen) {
  var $this = this;

  $this.seed = 4129327;
  $this.coords = {
    x: 100,
    y: 100
  };
  $this.size = 2;
  $this.detailCell = {};

  var sectors = mapgen.generate($this.seed,$this.coords.x,$this.coords.y,$this.size);
  $this.sectors = sectors;

  $this.class = function(cell) {
    if(cell.match(/(M|MSg|Mg|MVa|Mfl)/)) { return "m"; }
    if(cell.match(/(O|OSg|Og|OVa|Ofl)/)) { return "oba"; }
    if(cell.match(/(A|B)/)) { return "oba"; }
    if(cell.match(/(K)/)) { return "k"; }
    if(cell.match(/(G)/)) { return "g"; }
    if(cell.match(/(F)/)) { return "f"; }
    if(cell.match(/(Neb)/)) { return "nebula"; }
    if(cell.match(/(Wrm)/)) { return "wrm"; }
    if(cell.match(/(Neu)/)) { return "neutron"; }
    if(cell.match(/(Rad)/)) { return "radiation"; }
  };

  $this.generate = function() {
    var sectors = mapgen.generate($this.seed,$this.coords.x,$this.coords.y,$this.size);
    $this.sectors = sectors;

    //console.log(mapgen.noiseMap($this.seed,3));
  };

  $this.details = function(cell) {
    //console.log(cell);
    $this.detailCell = cell;
  };
};

fotsMapController.$inject = ["mapgenService"];

export const mapgenFots = {
  template: require('./mapgen.fots.html'),
  controller: fotsMapController,
  bindings: {}
};
