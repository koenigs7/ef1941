import { Injectable } from '@angular/core';
import { UnitComponent } from '../units/unit/unit.component';
import { Location } from '../model/location';
import { Direction } from '../model/direction';
import { UnitState, Nationality, Alliance } from '../units/unit/unit.enums';


@Injectable()
export class UnitService {

    units: UnitComponent[] = UnitComponent.allUnits;

    static activeUnitsFilter(unit: UnitComponent): boolean {
        return unit.state === UnitState.ACTIVE;
    }

    static alliesFilter(unit: UnitComponent): boolean {
        return unit.nationality === Nationality.RUSSIAN;
    }

    static axisFilter(unit: UnitComponent): boolean {
        return unit.nationality !== Nationality.RUSSIAN;
    }

    static militiaFilter(unit:UnitComponent): boolean {
        return unit.isMilitia();
    }


    unitAt(location: Location): UnitComponent {
        return this.units.find(unit => unit.x === location.x && unit.y === location.y && unit.state === UnitState.ACTIVE);
    }

    createZOCmap(alliance: Alliance) {
        const zocMap = new Map<string, number>();
        this.units.filter(UnitService.activeUnitsFilter).forEach(unit => {
            if ( 
                alliance === Alliance.ALLIES ? unit.nationality === Nationality.RUSSIAN : unit.nationality !== Nationality.RUSSIAN) {
                const loc = unit.getLocation();
                zocMap.set(loc.toString(), 1);
                zocMap.set(loc.ifMovedTo([Direction.NORTH]).toString(), 1);
                zocMap.set(loc.ifMovedTo([Direction.SOUTH]).toString(), 1);
                zocMap.set(loc.ifMovedTo([Direction.EAST]).toString(), 1);
                zocMap.set(loc.ifMovedTo([Direction.WEST]).toString(), 1);
                let zocLog = loc.ifMovedTo([Direction.NORTH, Direction.WEST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString()) ? 1 : .5);
                zocLog = loc.ifMovedTo([Direction.NORTH, Direction.EAST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString()) ? 1 : .5);
                zocLog = loc.ifMovedTo([Direction.SOUTH, Direction.WEST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString()) ? 1 : .5);
                zocLog = loc.ifMovedTo([Direction.SOUTH, Direction.EAST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString()) ? 1 : .5);
            }
        });
        return zocMap;
    }

}