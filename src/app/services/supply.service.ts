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
        console.log(this.zocMap);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality !== Nationality.RUSSIAN) {
 
                const supplyPercent = this.checkSupplyRoute( unit.getLocation(), 100, Direction.WEST);
                if (supplyPercent === 0) {
                    console.log(unit.name + ' out of supply');
                    unit.combatStrength -= Math.round(unit.combatStrength / 2);
                } else {
                    unit.combatStrength = +unit.combatStrength + Math.round((unit.musterStrength - unit.combatStrength) * supplyPercent / 100);
                }
            }
        });
        this.zocMap = this.unitService.createZOCmap(Alliance.AXIS);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality === Nationality.RUSSIAN) {
                this.zocMap.set(unit.getLocation().toString(), 0);
            }
        });
        console.log(this.zocMap);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality === Nationality.RUSSIAN) {
 
                const supplyPercent = this.checkSupplyRoute( unit.getLocation(), 100, Direction.EAST);
                if (supplyPercent === 0) {
                    console.log(unit.name + ' out of supply');
                    unit.combatStrength -= Math.round(unit.combatStrength / 2);
                } else {
                    unit.combatStrength = +unit.combatStrength + Math.round((unit.musterStrength - unit.combatStrength) * supplyPercent / 100);
                }
            }
        });

    }

    checkSupplyRoute(location: Location, percent: number, supplyDirection: Direction): number {
        if (supplyDirection === Direction.WEST && location.x < 1) return percent;
        if (supplyDirection === Direction.EAST && location.x > 44) return percent;
        const west = location.ifMovedTo([supplyDirection]);
        if (west.isValid() && this.zocMap.get(west.toString()) !== 1) {
            return this.checkSupplyRoute(west, percent - 1, supplyDirection);
        }
        const nwest = location.ifMovedTo([supplyDirection, Direction.NORTH]);
        if (nwest.isValid() && this.zocMap.get(nwest.toString()) !== 1) {
            return this.checkSupplyRoute(nwest, percent - 2, supplyDirection);
        }
        const swest = location.ifMovedTo([supplyDirection, Direction.SOUTH]);
        if (swest.isValid() && this.zocMap.get(swest.toString()) !== 1) {
            return this.checkSupplyRoute(swest, percent - 2, supplyDirection);
        }
        // console.log(west+','+nwest+','+swest+' blocked');
        return 0;
    }

}