import { Injectable } from '@angular/core';
import { UnitComponent } from '../units/unit/unit.component';
import { MapService } from './map.service';
import { UnitService } from './unit.service';
import { Direction } from '../model/direction';
import { Terrain } from '../model/terrain';
import { AudioService } from './audio.service';
import { CombatLossType, Nationality, Alliance } from '../units/unit/unit.enums';

@Injectable()
export class CombatService {

    constructor(private mapService: MapService, private unitService: UnitService, private audioService: AudioService) { }

    resolve(attacker: UnitComponent, defender: UnitComponent): any {
        let defenderStrength = defender.combatStrength;
        const defensiveValue = this.mapService.getTerrain(defender.getLocation()).defensiveValue;
        if (defensiveValue === 1) defenderStrength /= 2;
        if (defensiveValue === 3) defenderStrength *= 2 % 255;
        if (defender.orders.length) defenderStrength /= 2;
        const offensiveValue = this.mapService.getTerrain(attacker.getLocation()).offensiveValue;

        let random = Math.random();
        if (random < defenderStrength / 255) {
            console.log('defense succeeded', random, defenderStrength / 255);
            if (attacker.takeLossAndCheckForDead(CombatLossType.STANDARD)) {
                console.log(attacker.name + ' died attacking');
                return;
            }
        }
        let attackStrength = attacker.combatStrength;
        if (offensiveValue === 2) attackStrength /= 2;
        console.log(attackStrength, defenderStrength);
        random = Math.random();
        if (random > attackStrength / (defenderStrength + attackStrength)) {
            console.log('attack failed', random, attackStrength / (defenderStrength + attackStrength));
            return;
        }
        this.audioService.shot();

        if (defender.takeLossAndCheckForDead(CombatLossType.STANDARD)) {
            console.log(defender.name + ' died');
            return;
        }
        if (defender.isBroken()) {
            console.log(defender.name + ' must retreat');
            if (defender.takeLossAndCheckForDead(CombatLossType.RETREAT)) {
                console.log(defender.name + ' died after taking retreat loss');
                return;
            }
            const zocMap = this.unitService.createZOCmap(attacker.getAlliance());

            const retreatDirections = this.calculateRetreatDirections(attacker,defender);
            for (const retreatDirection of retreatDirections) {
                console.log(defender.name + ' retreating to the ' + retreatDirection);
                if (this.isZOCclear(zocMap, defender, retreatDirection)) {// OK to move there
                    defender.move(retreatDirection);
                    return;
                }
                if (defender.takeLossAndCheckForDead(CombatLossType.RETREAT)) {
                    console.log(defender.name + ' died trying to retreating to ' + retreatDirection);
                    return;
                }
            }
            console.log(defender.name + ' could not retreat any direction');
            if (defender.takeLossAndCheckForDead(CombatLossType.NORETREAT)) {
                console.log(defender.name + ' died could not retreat any direction');
                return;
            }
        }
    }

    isZOCclear(zocMap, defender: UnitComponent, retreatDirection) {
        const retreatLocation = defender.getLocation().ifMovedTo(retreatDirection);
        if (this.unitService.unitAt(retreatLocation)) {
            return false;
        }
        if (!retreatLocation.isValid()) {
            return false;
        }
        if (this.mapService.getTerrain(retreatLocation) === Terrain.SEA) {
            return false;
        }
        const value = zocMap.get(retreatLocation.toString());
        return (value !== 1);
    }

    getRandom(): number {
        return Math.random() * 255;
    }

    calculateRetreatDirections(attacker: UnitComponent, defender: UnitComponent): Direction[] {
        let retreatDirections = [];
        if (attacker.getLocation().x === defender.getLocation().x) {
            if (attacker.getLocation().y < defender.getLocation().y) {
                retreatDirections = defender.nationality === Nationality.RUSSIAN ?
                    [Direction.SOUTH, Direction.EAST, Direction.WEST] :
                    [Direction.SOUTH, Direction.WEST, Direction.EAST];
            } else {
                retreatDirections = defender.nationality === Nationality.RUSSIAN ?
                    [Direction.NORTH, Direction.EAST, Direction.WEST] :
                    [Direction.NORTH, Direction.WEST, Direction.EAST];
            }
        } else { // y == y
            if (attacker.getLocation().x < defender.getLocation().x) {
                retreatDirections =
                    [Direction.EAST, Direction.NORTH, Direction.SOUTH];
            } else {
                retreatDirections =
                    [Direction.WEST, Direction.NORTH, Direction.SOUTH];
            }
        }
        return retreatDirections;
    }

}