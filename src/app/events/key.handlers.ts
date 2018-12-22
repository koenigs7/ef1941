import { HostListener, Component } from '@angular/core';
import { OrderService } from '../services/move.service';
import { TurnService } from '../services/turn.service';

@Component({
    selector: 'app-event',
    template: ''
})
export class KeyHander {

    constructor(private moveService: OrderService, private combatService: TurnService) { }

    @HostListener('body:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        // do something meaningful with it
        // console.log(`The user just pressed ${ev.key}!`);
        this.moveService.addOrder(ev);
        if ( ev.keyCode === 83) {
            this.moveService.removeFocusedUnit();
            this.combatService.startCombat();
        }
    }
 
}