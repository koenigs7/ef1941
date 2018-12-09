import { Component, OnInit } from '@angular/core';
import { MoveService } from 'src/app/services/move.service';
import { BehaviorSubject } from 'rxjs';
import { CombatService } from 'src/app/services/combat.service';


export enum UnitType {
    ARMOR,
    INFANTRY
}

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

    public x;
    public y;
    public screenX;
    public screenY;
    public selected = false;
    public orders: number[] = [];
    public turnToMove = 0;
    public type: UnitType = UnitType.ARMOR;

    constructor(private moveService: MoveService, private combatService: CombatService) {
        combatService.addUnit(this);
        this.setXY(10,10);
    }


    ngOnInit() {
        this.moveService.movement.subscribe(direction => {
            if (direction) {
                this.orders.push(direction);
            }
        });
    }

    public setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.screenX = this.x * 40 + 13;
        this.screenY = this.y * 40 + 13;
        console.log('setting xy to '+x+','+y);
    }

    clicked(event) {
        this.selected = !this.selected;
        if (this.selected) {
            this.moveService.setFocusedUnit(this, this.x, this.y);
            this.screenX -= 2;
            this.screenY -= 2;
        } else {
            this.screenX += 2;
            this.screenY += 2;
            this.moveService.removeFocusedUnit(this);
        }
    }

    moveByOrders() {
        this.move(this.orders.shift());
        return this.orders[0];
    }

    move(direction: number) {
        console.log('moving '+direction);
        switch (direction) {
            case 1:
                this.y -= 1;
                break;
            case 2:
                this.x += 1;
                break;
            case 3:
                this.y += 1;
                break;
            case 4:
                this.x -=1 ;
                break;
        }
        this.setXY(this.x,this.y);
    }


    drag(event) {
        console.log(event);
    }

}
