import { HostListener, Component } from '@angular/core';
import { OrderService } from '../services/move.service';
import { CombatService } from '../services/combat.service';

@Component({
    selector: 'app-event',
    template: ''
})
export class KeyHander {

    constructor(private moveService: OrderService, private combatService: CombatService) { }

    @HostListener('body:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        // do something meaningful with it
        console.log(`The user just pressed ${ev.key}!`);
        this.moveService.addOrder(ev);
        if ( ev.keyCode === 83) {
            this.moveService.removeFocusedUnit();
            this.combatService.startCombat();
        }
    }
 

}