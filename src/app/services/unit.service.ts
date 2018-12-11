import { Injectable } from "@angular/core";
import { UnitComponent } from '../units/unit/unit.component';


@Injectable()
export class UnitService {

    units: UnitComponent[] = [];

    addUnit(u: UnitComponent) {
        this.units.push(u);
    }

    removeUnit(u:UnitComponent) {
        //this.units.
    }


    unitAt(x,y): UnitComponent {
        return this.units.find(unit => unit.x === x && unit.y === y );
    }


}