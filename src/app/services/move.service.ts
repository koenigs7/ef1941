import { Injectable } from "@angular/core";
import { UnitComponent } from '../units/unit/unit.component';
import { directiveDef } from '@angular/core/src/view';

@Injectable()
export class MoveService {

    focusedUnit: UnitComponent;
    setFocusedUnit(unit: UnitComponent) {
        this.focusedUnit = unit;
    }
    removeFocusedUnit(unit: UnitComponent) {
        this.focusedUnit = null;
    }

    moveFocusedUnit(ev: KeyboardEvent) {
        console.log(ev);
        if ( this.focusedUnit ) {
            let direction = ev.keyCode - 37;
            if ( direction == 0 ) direction  = 4;
            this.focusedUnit.move(direction);
            ev.preventDefault();
        }
    }

}