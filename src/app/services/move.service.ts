import { Injectable } from "@angular/core";
import { UnitComponent } from '../units/unit/unit.component';
import { directiveDef } from '@angular/core/src/view';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MoveService {

    focusedUnit: UnitComponent;
    public movement: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public focused: BehaviorSubject<number[]> = new BehaviorSubject(null);

    setFocusedUnit(unit: UnitComponent,x: number,y: number) {
        this.focusedUnit = unit;
        this.focused.next([unit.x,unit.y]);
    }
    removeFocusedUnit(unit: UnitComponent) {
        this.focusedUnit = null;
        this.focused.next(null);
    }

    moveFocusedUnit(ev: KeyboardEvent) {
        console.log(ev);
        if ( this.focusedUnit && ev.keyCode >= 37 && ev.keyCode <= 41 ) {
            let direction = ev.keyCode - 37;
            if ( direction == 0 ) direction  = 4;
            this.movement.next(direction);
            ev.preventDefault();
        }
    }

}