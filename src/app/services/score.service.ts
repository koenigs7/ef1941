import { Injectable } from '@angular/core';
import { UnitService } from './unit.service';
import { MapService } from './map.service';


@Injectable()
export class ScoreService {

    constructor(private unitService: UnitService, private mapService: MapService) {}

    calculateScore(): number {
        let score = 0;
        this.unitService.activeAxis().forEach(unit => {            
            score += unit.getLocation().x * unit.musterStrength;
        });

        this.unitService.activeAllies().forEach(unit => {
            score -= (45 - unit.getLocation().x) * unit.combatStrength;
        });
        return score;
    }

}
