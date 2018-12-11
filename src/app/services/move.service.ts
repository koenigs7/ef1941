import { Injectable } from "@angular/core";
import { UnitComponent } from '../units/unit/unit.component';
import { BehaviorSubject } from 'rxjs';
import { Direction } from '../model/direction';

@Injectable()
export class OrderService {

    focusedUnit: UnitComponent;
    public orders: BehaviorSubject<Direction> = new BehaviorSubject<Direction>(null);
    public focused: BehaviorSubject<UnitComponent> = new BehaviorSubject(null);

    setFocusedUnit(unit: UnitComponent) { 
        if ( unit === this.focusedUnit ) {
            this.removeFocusedUnit();
        }
        else if ( unit !== this.focusedUnit ) {
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
            if ( direction == Direction.NONE ) direction  = Direction.WEST;
            this.orders.next(direction);
            ev.preventDefault();
        }
    }

}