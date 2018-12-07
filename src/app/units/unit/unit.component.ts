import { Component, OnInit } from '@angular/core';
import { MoveService } from 'src/app/services/move.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

    public x = 53;
    public y = 53;
    public selected = false;
    private moves:number[] = [];

    constructor(private moveService: MoveService) { }
 

    ngOnInit() {
        this.moveService.movement.subscribe( direction =>{
            this.moves.push(direction);
        });
    }

    clicked(event) {
        this.selected = !this.selected;
        if ( this.selected ) { 
            this.moveService.setFocusedUnit(this,this.x,this.y);
            this.x -= 2;
            this.y -= 2;
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
