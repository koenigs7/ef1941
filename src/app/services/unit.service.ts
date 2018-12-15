import { Injectable } from '@angular/core';
import { UnitComponent } from '../units/unit/unit.component';
import { Location } from '../model/location';


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


}