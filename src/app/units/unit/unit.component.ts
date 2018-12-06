import { Component, OnInit } from '@angular/core';
import { MoveService } from 'src/app/services/move.service';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

    public x = 40;
    public y = 40;
    public selected = false;

    constructor(private moveService: MoveService) { }

    ngOnInit() {
    }

    clicked(event) {
        this.selected = !this.selected;
        if ( this.selected ) {
            this.x -= 2;
            this.y -= 2;
            this.moveService.setFocusedUnit(this);
        } else {
            this.x += 2;
            this.y += 2;
            this.moveService.removeFocusedUnit(this);
        }
    }

    move(direction: number) {
       switch(direction) {
           case 1:
                this.y -= 40;
                break;
            case 2:
                this.x += 40;
                break;
            case 3:
                this.y += 40;
                break;
            case 4:
                this.x -= 40;
                break;
       }
    }

    drag(event) {
        console.log(event);
    }

}
