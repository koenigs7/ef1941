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
        const multipler = this.mapService.getTerrain(defender.getLocation()).defensiveValue;
        if ( multipler === 2 ) defenderStrength /= 2;
        if ( multipler === 3 ) defenderStrength *= 2 % 255;
        if ( defender.orders.length ) defenderStrength /=2 ;

        if ( this.getRandom() > attacker.combatStrength ) {
            return;
        }
        this.audioService.shot();
        
        if (defender.takeLossAndCheckForDead(CombatLossType.STANDARD)) {
            console.log(defender.name+' died');
            return;
        }
        if ( defender.isBroken()) {
            console.log('defender must retreat');
            if (defender.takeLossAndCheckForDead(CombatLossType.RETREAT)) {
                console.log(defender.name+' died retreating');
                return;
            }
            const zocMap = this.unitService.createZOCmap(attacker.nationality===Nationality.RUSSIAN?Alliance.ALLIES:Alliance.AXIS);
            // try to retreat directly away first
            let retreatDirection = null;
            if ( attacker.getLocation().x === defender.getLocation().x ) {
                retreatDirection = attacker.getLocation().y < defender.getLocation().y ? Direction.SOUTH : Direction.NORTH; 
            } else {
                retreatDirection = attacker.getLocation().x < defender.getLocation().x ? Direction.EAST : Direction.WEST; 
            }
            console.log(retreatDirection);
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
        const value = zocMap.get(retreatLocation.offsetBy(retreatDirection).toString());
        return ( value !== 1);
    }

    getRandom(): number {
        return Math.random() * 255;
    }

}