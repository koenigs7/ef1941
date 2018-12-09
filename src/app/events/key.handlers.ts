import { HostListener, Component } from '@angular/core';
import { MoveService } from '../services/move.service';
import { CombatService } from '../services/combat.service';

@Component({
    selector: 'app-event',
    template: ''
})
export class KeyHander {

    constructor(private moveService: MoveService, private combatService: CombatService) { }

    @HostListener('body:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        // do something meaningful with it
        console.log(`The user just pressed ${ev.key}!`);
        this.moveService.addOrder(ev);
        if ( ev.keyCode === 83) {
            this.combatService.startCombat();
        }
    }
 

}