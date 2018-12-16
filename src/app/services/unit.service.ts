import { Injectable } from '@angular/core';
import { UnitComponent, UnitType, UnitState, Nationality } from '../units/unit/unit.component';
import { Location } from '../model/location';
import { Direction } from '../model/direction'; 


@Injectable()
export class UnitService {

    units: UnitComponent[] = [];

    addUnit(u: UnitComponent) {
        this.units.push(u);
    }

    removeUnit(u:UnitComponent) {
        // this.units.
    }


    unitAt(location: Location): UnitComponent {
        return this.units.find(unit => unit.x === location.x && unit.y === location.y );
    }

    createZOCmap(nationality: Nationality) {
        const zocMap = new Map<string,number>();
        this.units.forEach(unit => {
            if ( unit.state === UnitState.ACTIVE && unit.nationality === nationality ) {
                const loc = unit.getLocation();
                zocMap.set(loc.toString(),1);
                zocMap.set(loc.ifMovedTo([Direction.NORTH]).toString(),1);
                zocMap.set(loc.ifMovedTo([Direction.SOUTH]).toString(),1);
                zocMap.set(loc.ifMovedTo([Direction.EAST]).toString(),1);
                zocMap.set(loc.ifMovedTo([Direction.WEST]).toString(),1);
                let zocLog = loc.ifMovedTo([Direction.NORTH,Direction.WEST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString())?1:.5 );
                zocLog = loc.ifMovedTo([Direction.NORTH,Direction.EAST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString())?1:.5 );
                zocLog = loc.ifMovedTo([Direction.SOUTH,Direction.WEST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString())?1:.5 );
                zocLog = loc.ifMovedTo([Direction.SOUTH,Direction.EAST]);
                zocMap.set(zocLog.toString(), zocMap.get(zocLog.toString())?1:.5 );
            }
        });
        return zocMap;
    }

}