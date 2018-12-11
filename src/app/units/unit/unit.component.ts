import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/move.service';
import { BehaviorSubject } from 'rxjs';
import { CombatService } from 'src/app/services/combat.service';
import { MapService } from 'src/app/services/map.service';
import { UnitService } from 'src/app/services/unit.service';
import { Direction } from 'src/app/model/direction';

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

    @Input() x: number;
    @Input() y: number;
    @Input() name: string;

    public screenX;
    public screenY;
    public selected = false;
    public orders: Direction[] = [];
    public turnToMove = 0;
    public type: UnitType = UnitType.ARMOR;

    constructor(private moveService: OrderService, private combatService: CombatService, private mapService: MapService, private unitService: UnitService) {
        this.unitService.addUnit(this);
    }


    ngOnInit() {
        this.x = +this.x;
        this.y = +this.y;
        this.setXY(this.x, this.y);
        this.moveService.orders.subscribe(direction => {
            if (direction && this.selected) {
                this.orders.push(direction);
            }
        });
        this.moveService.focused.subscribe(unit => {
            if (this === unit && !this.selected) {
                this.screenX -= 2;
                this.screenY -= 2;
                this.selected = true;
            } else if (this.selected === true) {
                this.screenX += 2;
                this.screenY += 2;
                this.selected = false;
            }
        })
    }

    public setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.screenX = this.x * 40 + 13;
        this.screenY = this.y * 40 + 13;
        console.log('setting xy to ' + x + ',' + y);
    }

    clicked(event) {
        console.log(this.mapService.getTerrainAt(this.x, this.y));
        this.moveService.setFocusedUnit(this);
    }

    moveByOrders() {
        console.log("moving " + this.name + " to " + this.orders[0]);
        this.move(this.orders.shift());
        return this.orders[0];
    }

    nextOrder(): Direction {
        return this.orders[0];
    }

    calculatePositionUsingOrders(orders: Direction[]): number[] {
        let x = this.x;
        let y = this.y;
        orders.forEach(order => {
            switch (order) {
                case Direction.NORTH:
                    y -= +1;
                    break;
                case Direction.EAST:
                    x += +1;
                    break;
                case Direction.SOUTH:
                    y += +1;
                    break;
                case Direction.WEST:
                    x -= +1;
                    break;
            }
        });
        return [x, y];
    }

    move(direction: number) {
        console.log('moving ' + direction);
        switch (direction) {
            case 1:
                this.y -= +1;
                break;
            case 2:
                this.x += +1;
                break;
            case 3:
                this.y += +1;
                break;
            case 4:
                this.x -= +1;
                break;
        }
        this.setXY(this.x, this.y);
    }


    drag(event) {
        console.log(event);
    }

}
