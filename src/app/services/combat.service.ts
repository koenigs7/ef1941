import { Injectable } from '@angular/core';
import { UnitComponent } from '../units/unit/unit.component';
import { MapService } from './map.service';

@Injectable()
export class CombatService {

    constructor(private mapService: MapService) {}
    
    resolve(attacker: UnitComponent, defender: UnitComponent): any {
        let defenderStrength = defender.combatStrength;
        const multipler = defender.getTerrain().defensiveValue;
        if ( multipler === 2 ) defenderStrength /= 2;
        if ( multipler === 3 ) defenderStrength *= 2 % 255;
        if ( defender.orders.length ) defenderStrength /=2 ;

        if ( this.getRandom() < attacker.combatStrength ) {
            defender.musterStrength -= 1;
            defender.combatStrength -= 5;
        }

    }

    getRandom(): number {
        return Math.random() * 255;
    }

}