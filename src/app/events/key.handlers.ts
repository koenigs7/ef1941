import { HostListener, Component } from '@angular/core';
import { TurnService } from '../services/turn.service';
import { UnitComponent } from '../units/unit/unit.component';
import { Direction } from '../model/direction';
import { UnitService } from '../services/unit.service';

@Component({
    selector: 'app-event',
    template: ''
})
export class KeyHanderComponent {

    constructor( private combatService: TurnService, private unitService: UnitService ) { }

    @HostListener('body:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        // do something meaningful with it
        // console.log(`The user just pressed ${ev.key}!`);

        if ( ev.keyCode >= 37 && ev.keyCode <= 41 ) {
            let direction = ev.keyCode - 37;
            if ( direction === Direction.NONE ) direction  = Direction.WEST;
            UnitComponent.AddOrder(direction); 
            ev.preventDefault();
        }
        if ( ev.keyCode === 83 ) {  // S
            UnitComponent.ClearSelected();
            this.combatService.startCombat();
        }
        if ( ev.keyCode === 67 ) {  // C
            UnitComponent.ClearOrders();
        }
        if ( ev.keyCode === 70 ) { // F
            this.unitService.activeAxis().forEach(unit => {
                unit.orders.push(Direction.EAST);
                unit.orders.push(Direction.EAST);
                unit.orders.push(Direction.EAST);
                unit.orders.push(Direction.EAST);
                unit.orders.push(Direction.EAST);
            });
        }
    }
}