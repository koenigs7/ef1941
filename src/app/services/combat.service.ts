import { Injectable } from '@angular/core';
import { UnitComponent, CombatLossType } from '../units/unit/unit.component';
import { MapService } from './map.service';
import { UnitService } from './unit.service';

@Injectable()
export class CombatService {

    constructor(private mapService: MapService, private unitService: UnitService) {}
    
    resolve(attacker: UnitComponent, defender: UnitComponent): any {
        let defenderStrength = defender.combatStrength;
        const multipler = defender.getTerrain().defensiveValue;
        if ( multipler === 2 ) defenderStrength /= 2;
        if ( multipler === 3 ) defenderStrength *= 2 % 255;
        if ( defender.orders.length ) defenderStrength /=2 ;

        if ( this.getRandom() > attacker.combatStrength ) {
            return;
        }
        if (defender.takeLossAndCheckForDead(CombatLossType.STANDARD)) {
            console.log(defender.name+' died');
            return;
        }
        if ( defender.isBroken()) {
            console.log('defender must retreat');
            const map = this.unitService.createZOCmap(attacker.nationality);
            console.log(map);
        }

    }

    getRandom(): number {
        return Math.random() * 255;
    }

}