import { UnitComponent, Nationality, Alliance } from '../units/unit/unit.component';
import { UnitService } from './unit.service';
import { Injectable } from '@angular/core';
import { Location } from '../model/location';
import { Direction } from '../model/direction';

@Injectable()
export class SupplyService {

    zocMap: Map<String, Number>;

    constructor(private unitService: UnitService) {

    }

    calculateSupply() {
        // Calculate Axis supply.  Create Allies ZOC map, remove ZOC where Axis are, then check for route
        this.zocMap = this.unitService.createZOCmap(Alliance.ALLIES);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality !== Nationality.RUSSIAN) {
                this.zocMap.set(unit.getLocation().toString(), 0);
            }
        });
        console.log('alliesZocMap', this.zocMap);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality !== Nationality.RUSSIAN) {
                unit.supplyPath = [];
                console.log('calculating for ',unit.name);
                let supplyPercent = this.checkSupplyRoute(unit, unit.getLocation(), 100, Direction.WEST, Direction.WEST,[]);
                if (supplyPercent === 0) {
                    console.log(unit.name + ' out of supply');
                    unit.combatStrength -= Math.round(unit.combatStrength / 2);
                } else {
                    supplyPercent = Math.min(supplyPercent, 100);
                    unit.combatStrength = +unit.combatStrength + Math.round((unit.musterStrength - unit.combatStrength) * supplyPercent / 100);
                }
                unit.supplyPercent = supplyPercent + '';
            }
        });


        this.zocMap = this.unitService.createZOCmap(Alliance.AXIS);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality === Nationality.RUSSIAN) {
                this.zocMap.set(unit.getLocation().toString(), 0);
            }
        });
        console.log('axisZocMap', this.zocMap);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality === Nationality.RUSSIAN) {
                unit.supplyPath = [];
                const supplyPercent = this.checkSupplyRoute(unit, unit.getLocation(), 120, Direction.EAST, Direction.EAST,[]);
                if (supplyPercent === 0) {
                    console.log(unit.name + ' out of supply');
                    unit.combatStrength -= Math.round(unit.combatStrength / 2);
                } else {
                    unit.combatStrength = +unit.combatStrength + Math.round((unit.musterStrength - unit.combatStrength) * supplyPercent / 100);
                }
                unit.supplyPercent = supplyPercent + '';
            }
        });

    }

    checkSupplyRoute(unit: UnitComponent, location: Location, percent: number, supplyDirection: Direction, 
                lastDirection: Direction, deadSquares: string[]): number {
        if ( unit.name === '56 Panzer Corps') {
            console.log(location);
        }
        if (supplyDirection === Direction.WEST && location.x < 1) return percent;
        if (supplyDirection === Direction.EAST && location.x > 44) return percent;
        if (unit.supplyPath.length > 100) {
            console.log('long path');
            return 0;
        }
        const eastOrWest = location.ifMovedTo([supplyDirection]);
        if (eastOrWest.isValid() && this.zocMap.get(eastOrWest.toString()) !== 1 && !deadSquares.includes(eastOrWest.toString())) {
            const index = unit.supplyPath.length;
            const rc = this.checkSupplyRoute(unit, eastOrWest, percent - 1, supplyDirection, supplyDirection, deadSquares);
            if (rc > 0) {
                unit.supplyPath.splice(index , 0, supplyDirection);
                return rc;
            }
        }
        const north = location.ifMovedTo([Direction.NORTH]);
        if (north.isValid() && this.zocMap.get(north.toString()) !== 1 && lastDirection !== Direction.SOUTH && !deadSquares.includes(eastOrWest.toString())) {
            const index = unit.supplyPath.length;
            const rc = this.checkSupplyRoute(unit, north, percent - 2, supplyDirection, Direction.NORTH, deadSquares);
            if (rc > 0) {
                unit.supplyPath.splice(index ,0,Direction.NORTH);
                return rc;
            }
        }
        const south = location.ifMovedTo([Direction.SOUTH]);
        if (south.isValid() && this.zocMap.get(south.toString()) !== 1 && lastDirection !== Direction.NORTH && !deadSquares.includes(eastOrWest.toString())) {
            const index = unit.supplyPath.length;
            const rc = this.checkSupplyRoute(unit, south, percent - 2, supplyDirection, Direction.SOUTH, deadSquares);
            if (rc > 0) {
                unit.supplyPath.splice(index ,0,Direction.SOUTH);
                return rc;
            }
        }
        // console.log(west+','+nwest+','+swest+' blocked');
        if ( unit.name === '56 Panzer Corps') {
            console.log('dead end', location);
        }
        deadSquares.push(location.toString());
        return 0;
    }

}