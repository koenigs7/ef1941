import { HostListener, Component } from '@angular/core';
import { MoveService } from '../services/move.service';

@Component({
    selector: 'app-event',
    template: ''
})
export class KeyHander {

    constructor(private moveService: MoveService) { }

    @HostListener('body:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        // do something meaningful with it
        console.log(`The user just pressed ${ev.key}!`);
        this.moveService.moveFocusedUnit(ev);
    }
 

}