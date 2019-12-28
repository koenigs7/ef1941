import { Injectable } from '@angular/core';
import { Nationality, UnitComponent } from '../units/unit/unit.component';
import { UnitService } from './unit.service';
import { Direction } from '../model/direction';
import { Location } from '../model/location';

@Injectable()
export class AIService {

    ifrMap = new Map<String, IFR>();

    reinforcements: UnitComponent[] = [];

    constructor(private unitService: UnitService) {
    }

    calculateIFRs(nationality: Nationality) {

        this.unitService.units.filter(UnitService.activeUnitsFilter).filter(UnitService.alliesFilter).forEach(
            unit => {
                const ifr = new IFR();
                const unitLoc = unit.getLocation();
                this.unitService.units.filter(UnitService.activeUnitsFilter).filter(UnitService.axisFilter).forEach(enemyUnit => {
                    const distance = unitLoc.distanceTo(enemyUnit.getLocation());
                    if (distance < 7 ) {
                        const threat = enemyUnit.combatStrength / 16 - distance;
                        if (threat > 0) {
                            ifr.ifrs[unitLoc.directionTo(enemyUnit.getLocation())] += threat;
                        }
                    }
                });
                ifr.ifrs[0] = ifr.ifrs[1] + ifr.ifrs[2] + ifr.ifrs[3] + ifr.ifrs[4];
                if (ifr.ifrs[0] === 0 && !unit.name.includes('Militia')) {
                    this.reinforcements.push(unit);
                }
                this.ifrMap.set(unit.name, ifr);
                console.log(unit.name + ifr.ifrs);
            }
        );


        this.reinforcements.forEach(unit => {
            let mostTrouble = 0;
            let unitToSave;
            this.unitService.units.filter(UnitService.activeUnitsFilter).filter(UnitService.alliesFilter).forEach(testunit => {
                const trouble = this.ifrMap.get(testunit.name).ifrs[0] / unit.getLocation().distanceTo(testunit.getLocation());
                if (trouble > mostTrouble) {
                    mostTrouble = trouble;
                    unitToSave = testunit;
                }
            });
            unit.orders = this.createOrdersToMove(unit.getLocation(),unitToSave.getLocation());
            console.log(unit.name + ' reinforcing ' + unitToSave.name + ' at ' + unitToSave.getLocation() + ' with orders '+unit.orders);

        });

    }


    createOrdersToMove(start: Location, end: Location): Direction[] {
        const orders: Direction[] = [];
        const difX = end.x - start.x;
        const difY = end.y - start.y;
        if (difX === 0) {
            for (let i = 0; i < difY; i++) {
                orders.push(difY > 0? Direction.SOUTH: Direction.NORTH);
            }
        } else if ( difX < 0 ) {
            if ( Math.abs(difX) > Math.abs(difY) ) {
                let y = 0;
                for (let i = 0; i < -difX; i++) {
                    orders.push(Direction.WEST);
                    y += difY/difX;
                    if ( y > 1 ) {
                        y = y-1;
                        orders.push(Direction.NORTH);
                    }
                    if ( y < -1 ) {
                        y = y+1;
                        orders.push(Direction.SOUTH);
                    }
                }
            }
        }


        return orders;
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