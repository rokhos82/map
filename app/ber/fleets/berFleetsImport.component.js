/**
 * @class BER.berFleetsImport
 * @memberOf BER
 * @desc Imports fleet files
 */
class berFleetsImportController {
  constructor($scope,archive,parser,$state) {
    this.$scope = $scope;
    this.archive = archive;
    this.parser = parser;
    this.$state = $state;

    this.attackers = `TEST,It Was Like That When We Got Here,50,2,36,0,0,0,,,,,
Ultimate Frigate 1,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis][bp 10 0] DAMAGE 75 BREAK 50
Ultimate Frigate 2,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 3,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50
Ultimate Frigate 4,8,8,1,1,0,0,18,18,0,0,0,[8 target 85 long dis] DAMAGE 75 BREAK 50`;
    this.defenders = `TEST,Test Fleet Please Ignore,50,15,95,15,0,0,0,,,,
Cheap Screen Corvette 1,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 offline offline] DEFENSE 25 DAMAGE 90 FLICKER 10 DL hamtaro SR 2
Cheap Screen Corvette 2,1,1,5,5,0,0,5,5,0,0,0,[1 target 90] DEFENSE 25 DAMAGE 90 FLICKER 10 DL hamtaro SR 2
Cheap Screen Corvette 3,1,1,5,5,0,0,5,5,0,0,0,[1 target 90] DEFENSE 25 DAMAGE 90 FLICKER 10 DL hamtaro SR 2
Cheap Screen Corvette 4,1,1,5,5,0,0,5,5,0,0,0,[1 target 90] DEFENSE 25 DAMAGE 90 FLICKER 10 DL hamtaro SR 2
Cheap Missile Corvette 1,0,0,0,0,6,6,5,5,0,0,0,[6 mis0011 target 15 ammo 2] DEFENSE 25 DAMAGE 90
Cheap Missile Corvette 2,0,0,0,0,6,6,5,5,0,0,0,[6 mis0011 target 15 ammo 2] DEFENSE 25 DAMAGE 90
Cheap Missile Corvette 3,0,0,0,0,6,6,5,5,0,0,0,[6 mis0011 target 15 ammo 2] DEFENSE 25 DAMAGE 90
Cheap Missile Corvette 4,0,0,0,0,6,6,5,5,0,0,0,[6 mis0011 target 15 ammo 2] DEFENSE 25 DAMAGE 90
Artillery Frigate 1,8,8,1,1,0,0,9,9,0,0,0,[8 target 90 artillery] RESERVE 50 DAMAGE 90
Artillery Frigate 2,8,8,1,1,0,0,9,9,0,0,0,[8 target 90] RESERVE 10 DAMAGE 90`;

    this.prebuiltFleetsList = {
      "simple1":"Simple Red Team",
      "simple2":"Simple Blue Team"
    };
    this.prebuiltFleets = {};
    this.prebuiltFleets["simple1"] = `Red,Simple 1,50,5,20,0,0,0,0
Red Team Corvette 1,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Red Team Corvette 2,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Red Team Corvette 3,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Red Team Corvette 4,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Red Team Corvette 5,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90`;
    this.prebuiltFleets["simple2"] = `Blue,Simple 2,50,5,20,0,0,0,0
Blue Team Corvette 1,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Blue Team Corvette 2,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Blue Team Corvette 3,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Blue Team Corvette 4,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90
Blue Team Corvette 5,1,1,5,5,0,0,5,5,0,0,0,[10 target 90] DEFENSE 25 DAMAGE 90`;
  }

  $onInit() {}

  importFleet() {
    // Parse the fleet file
    let fleetFile = this.parser.parseFleet(this.fleetFile);
    this.archive.setFleet(fleetFile.uuid,fleetFile);
    this.archive.serializeFleets();
    this.fleetFile = "";
  }

  importFleetAndGo() {
    this.importFleet();
    this.$state.go("^.list");
  }

  loadAttackFleet() {
    this.fleetFile = this.attackers;
  }

  loadDefenseFleet() {
    this.fleetFile = this.defenders;
  }

  loadFighterFleet() {
    this.fleetFile = `KSE,1st Fleet,75,20,20,20,,,,
F1001 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1002 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1003 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1004 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1005 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1006 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1007 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1008 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1009 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1010 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1011 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1012 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1013 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1014 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1015 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1016 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1017 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1018 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1019 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER
F1020 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[2 mis0041 ammo 1 target 15][1 mis0001] DEFENSE 15 FIGHTER`;
  }

  loadFleet(key) {
    this.fleetFile = this.prebuiltFleets[key];
  }
}

berFleetsImportController.$inject = ["$scope","berArchive","berParser","$state"];

export const berFleetsImport = {
  bindings: {},
  controller: berFleetsImportController,
  template: require('./berFleetsImport.component.html')
};
