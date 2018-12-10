import { Injectable } from "@angular/core";
import { UnitComponent } from '../units/unit/unit.component';
import { directiveDef } from '@angular/core/src/view';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class OrderService {

    focusedUnit: UnitComponent;
    public orders: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public focused: BehaviorSubject<UnitComponent> = new BehaviorSubject(null);

    setFocusedUnit(unit: UnitComponent) { 
        if ( unit === this.focusedUnit ) {
            this.removeFocusedUnit();
        }
        if ( unit != this.focusedUnit ) {
            this.focusedUnit = unit;
            this.focused.next(unit);
        }
    }

    removeFocusedUnit() {
        this.focusedUnit = null;
        this.focused.next(null);
    }

    addOrder(ev: KeyboardEvent) {
        console.log(ev);
        if ( this.focusedUnit && ev.keyCode >= 37 && ev.keyCode <= 41 ) {
            let direction = ev.keyCode - 37;
            if ( direction == 0 ) direction  = 4;
            this.orders.next(direction);
            ev.preventDefault();
        }
    }

}