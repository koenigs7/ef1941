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

    constructor(private mapService: MapService, private unitService: UnitService, private audioService: AudioService) {}
    
    resolve(attacker: UnitComponent, defender: UnitComponent): any {
        let defenderStrength = defender.combatStrength;
        const defensiveValue = this.mapService.getTerrain(defender.getLocation()).defensiveValue;
        if ( defensiveValue === 1 ) defenderStrength /= 2;
        if ( defensiveValue === 3 ) defenderStrength *= 2 % 255;
        if ( defender.orders.length ) defenderStrength /=2 ;
        let attackStrength = attacker.combatStrength;
        const offensiveValue = this.mapService.getTerrain(attacker.getLocation()).offensiveValue;
        if ( offensiveValue === 2 ) attackStrength /= 2;
        console.log(attackStrength,defenderStrength);

        if ( Math.random() < defenderStrength/255 ) { 
            console.log('defense succeeded');
            if ( attacker.takeLossAndCheckForDead(CombatLossType.STANDARD)) {
                console.log(attacker.name+' died attacking');
            }
            return;
        }
        const random = Math.random();
        if ( random > attackStrength/(defenderStrength+attackStrength) ) {
            console.log('attack failed',random,attackStrength/(defenderStrength+attackStrength));
            return;
        }
        this.audioService.shot();
        
        if (defender.takeLossAndCheckForDead(CombatLossType.STANDARD)) {
            console.log(defender.name+' died');
            return;
        }
        if ( defender.isBroken()) {
            console.log(defender.name + ' must retreat');
            if (defender.takeLossAndCheckForDead(CombatLossType.RETREAT)) {
                console.log(defender.name+' died retreating');
                return;
            }
            const zocMap = this.unitService.createZOCmap(attacker.getAlliance());
            // try to retreat directly away first
            let retreatDirection = null;
            if ( attacker.getLocation().x === defender.getLocation().x ) {
                retreatDirection = attacker.getLocation().y < defender.getLocation().y ? Direction.SOUTH : Direction.NORTH; 
            } else {
                retreatDirection = attacker.getLocation().x < defender.getLocation().x ? Direction.EAST : Direction.WEST; 
            }
            console.log(defender.name + ' retreating to the ' + retreatDirection);
            if ( this.isZOCclear(zocMap,defender,retreatDirection) ) {// OK to move there
                defender.move(retreatDirection);
                return;
            }
            // try another retreat direction 
            if (defender.takeLossAndCheckForDead(CombatLossType.RETREAT)) {
                console.log(defender.name+' died retreating new direction');
                return;
            }
            retreatDirection = retreatDirection === Direction.WEST ? Direction.NORTH : retreatDirection + 1;
            console.log(defender.name + ' retreating to the ' + retreatDirection);

            if ( this.isZOCclear(zocMap,defender,retreatDirection) ) {// OK to move there
                defender.move(retreatDirection);
                return;
            }
            // try last retreat direction 
            if (defender.takeLossAndCheckForDead(CombatLossType.RETREAT)) {
                console.log(defender.name+' died retreating last direction');
                return;
            }
            retreatDirection = retreatDirection > 2 ? retreatDirection -2 : retreatDirection + 2;
            console.log(defender.name + ' retreating to the ' + retreatDirection);

            if ( this.isZOCclear(zocMap,defender,retreatDirection) ) {// OK to move there
                defender.move(retreatDirection);
                return;
            }
            console.log('defender could not retreat '+retreatDirection);
            if (defender.takeLossAndCheckForDead(CombatLossType.NORETREAT)) {
                console.log(defender.name+' died could not retreat any direction');
                return;
            } 
            console.log(defender.name + ' could not retreat');
        }

    }

    isZOCclear(zocMap,defender:UnitComponent,retreatDirection) {
        const retreatLocation = defender.getLocation().ifMovedTo([retreatDirection]);
        if ( this.unitService.unitAt(retreatLocation)) {
            return false;
        }
        if ( !retreatLocation.isValid()) {
            return false;
        }
        if ( this.mapService.getTerrain(retreatLocation) === Terrain.SEA ) {
            return false;
        }
        const value = zocMap.get(retreatLocation.toString());
        return ( value !== 1);
    }

    getRandom(): number {
        return Math.random() * 255;
    }

}