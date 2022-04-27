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
      "simple2":"Simple Blue Team",
      "simple3":"Corvette Plus Fighter Screen"
    };
    this.prebuiltFleets = {};
    this.prebuiltFleets["simple1"] = `Red,Simple 1,50,5,20,0,0,0,0
Red Team Corvette 1,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Red Team Corvette 2,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Red Team Corvette 3,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Red Team Corvette 4,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Red Team Corvette 5,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70`;
    this.prebuiltFleets["simple2"] = `Blue,Simple 2,50,5,20,0,0,0,0
Blue Team Corvette 1,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Blue Team Corvette 2,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Blue Team Corvette 3,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Blue Team Corvette 4,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70
Blue Team Corvette 5,1,1,5,5,0,0,5,5,0,0,0,[1 target 90 yield 90] DEFENSE 25 DAMAGE 70`;
    this.prebuiltFleets["simple3"] = `TEST,Corvette Plus Screen,75,273,378,0,0,0,0,0
CV1-0001 (Fleet Carrier Mk 1),0,0,1,1,0,0,6,6,0,0,0,DEFENSE 15 RESIST 5 CARRIER RESERVE 99 FLEE
CV1-0002 (Fleet Carrier Mk 1),0,0,1,1,0,0,6,6,0,0,0,DEFENSE 15 RESIST 5 CARRIER RESERVE 99 FLEE
CV1-0003 (Fleet Carrier Mk 1),0,0,1,1,0,0,6,6,0,0,0,DEFENSE 15 RESIST 5 CARRIER RESERVE 99 FLEE
K2-0001 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0002 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0003 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0004 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0005 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0006 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0007 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0008 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0009 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0010 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0011 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0012 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0013 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0014 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0015 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0016 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0017 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0018 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0019 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0020 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0021 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0022 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0023 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0024 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0025 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0026 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0027 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0028 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0029 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
K2-0030 (Fleet Beam Corvette Mk 2 Block A),8,8,0,0,0,0,4,4,0,0,0,[8 target 30] DEFENSE -15 RESIST 5
F1-4-0001 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0002 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0003 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0004 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0005 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0006 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0007 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0008 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0009 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0010 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0011 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0012 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0013 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0014 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0015 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0016 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0017 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0018 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0019 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0020 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0021 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0022 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0023 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0024 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0025 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0026 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0027 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0028 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0029 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0030 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0031 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0032 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0033 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0034 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0035 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0036 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0037 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0038 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0039 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0040 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0041 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0042 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0043 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0044 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0045 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0046 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0047 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0048 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0049 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0050 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0051 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0052 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0053 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0054 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0055 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0056 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0057 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0058 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0059 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0060 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0061 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0062 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0063 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0064 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0065 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0066 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0067 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0068 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0069 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0070 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0071 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0072 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0073 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0074 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0075 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0076 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0077 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0078 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0079 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0080 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0081 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0082 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0083 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0084 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0085 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0086 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0087 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0088 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0089 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0090 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0091 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0092 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0093 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0094 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0095 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0096 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0097 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0098 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0099 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0100 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0101 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0102 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0103 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0104 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0105 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0106 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0107 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0108 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0109 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0110 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0111 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0112 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0113 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0114 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0115 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0116 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0117 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0118 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0119 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0120 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0121 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0122 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0123 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0124 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0125 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0126 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0127 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0128 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0129 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0130 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0131 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0132 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0133 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0134 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0135 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0136 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0137 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0138 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0139 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0140 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0141 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0142 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0143 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0144 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0145 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0146 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0147 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0148 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0149 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0150 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0151 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0152 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0153 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0154 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0155 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0156 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0157 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0158 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0159 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0160 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0161 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0162 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0163 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0164 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0165 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0166 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0167 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0168 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0169 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0170 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0171 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0172 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0173 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0174 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0175 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0176 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0177 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0178 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0179 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0180 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0181 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0182 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0183 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0184 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0185 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0186 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0187 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0188 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0189 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0190 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0191 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0192 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0193 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0194 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0195 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0196 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0197 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0198 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0199 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0200 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0201 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0202 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0203 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0204 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0205 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0206 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0207 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0208 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0209 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0210 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0211 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0212 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0213 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0214 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0215 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0216 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0217 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0218 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0219 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0220 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0221 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0222 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0223 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0224 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0225 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0226 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0227 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0228 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0229 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0230 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0231 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0232 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0233 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0234 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0235 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0236 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0237 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0238 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0239 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER
F1-4-0240 (Fighter Mk 1-4),0,0,0,0,4,4,1,1,0,0,0,[1 mis0041 ammo 2 target 15] DEFENSE 15 FIGHTER`;
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
