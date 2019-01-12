import { Injectable } from '@angular/core';
import { Nationality } from '../units/unit/unit.component';
import { UnitService } from './unit.service';

@Injectable()
export class AIService {

    ifrMap = new Map<String, IFR>();

    constructor(private unitService: UnitService) {
    }

    calculateIFRs(nationality: Nationality) {

        this.unitService.units.filter(UnitService.activeUnitsFilter).filter(UnitService.alliesFilter).forEach(
            unit => {
                let ifr: IFR = this.ifrMap.get(unit.name);
                if (!ifr) {
                    ifr = new IFR();
                }
                const unitLoc = unit.getLocation();
                this.unitService.units.filter(UnitService.activeUnitsFilter).filter(UnitService.axisFilter).forEach(enemyUnit => {
                    const distance = unitLoc.distanceTo(enemyUnit.getLocation());
                    if (distance < 8) {
                        const threat = enemyUnit.combatStrength / 16 - distance;
                        if (threat > 0) {
                            ifr.ifrs[unitLoc.directionTo(enemyUnit.getLocation())] += threat;
                        }
                    }
                });
                console.log(unit.name + ifr.ifrs);
            }
        );
    }



}

class IFR {
    constructor() {
        this.ifrs = [];
        this.ifrs[0] = 0;
        this.ifrs[1] = 0;
        this.ifrs[2] = 0;
        this.ifrs[3] = 0;
        this.ifrs[4] = 0;

    }
    ifrs: number[];
}