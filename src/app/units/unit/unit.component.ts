import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/move.service';
import { TurnService } from 'src/app/services/turn.service';
import { MapService } from 'src/app/services/map.service';
import { UnitService } from 'src/app/services/unit.service';
import { Direction } from 'src/app/model/direction';
import { Location } from 'src/app/model/location';
import { Terrain } from 'src/app/model/terrain';

export enum Nationality {
    GERMAN = 'G',
    RUSSIAN = 'R',
    FINNISH = 'F'
}

export enum UnitType {
    ARMOR,
    INFANTRY
}

export enum CombatLossType {
    STANDARD = 1,
    RETREAT = 2,
    NORETREAT = 3
}

export enum UnitState {
    ACTIVE,
    DEAD,
    WAITING
}

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

    static SELECTED_BORDER_WIDTH = 5;

    @Input() x: number;
    @Input() y: number;
    @Input() name: string;
    @Input() nationality: Nationality;
    @Input() musterStrength: number;

    public combatStrength;
    public screenX;
    public screenY;
    private z = 2;
    public selected = false;
    public orders: Direction[] = [];
    public turnToMove = 0;
    public type: UnitType = UnitType.ARMOR;
    public state:UnitState = UnitState.ACTIVE;

    constructor(private moveService: OrderService, private combatService: TurnService, private mapService: MapService, private unitService: UnitService) {
        this.unitService.addUnit(this);
    }


    ngOnInit() { 
        this.combatStrength = this.musterStrength;
        this.setLocation(new Location(+this.x, +this.y));
        this.moveService.orders.subscribe(direction => {
            if (direction && this.selected) {
                this.orders.push(direction);
            }
        });
        this.moveService.focused.subscribe(unit => {
            if (this === unit && !this.selected) {
                this.screenX -= UnitComponent.SELECTED_BORDER_WIDTH;
                this.screenY -= UnitComponent.SELECTED_BORDER_WIDTH;
                this.z = 3;
                this.selected = true;
            } else if (this.selected === true) {
                this.screenX += UnitComponent.SELECTED_BORDER_WIDTH;
                this.screenY += UnitComponent.SELECTED_BORDER_WIDTH;
                this.z = 2;
                this.selected = false;
            }
        });
    }

    public setLocation(location: Location) {
        this.x = location.x;
        this.y = location.y;
        this.screenX = this.x * 40 + 13;
        this.screenY = this.y * 40 + 13;
        console.log('setting location to ' + location);
    }

    public getLocation(): Location {
        return new Location(this.x, this.y);
    }

    getTerrain(): Terrain {
        return this.mapService.getTerrainAt(this.x, this.y);
    }

    clicked(event) {
        this.moveService.setFocusedUnit(this);
    }

    moveByOrders(): Direction {
        if (this.orders[0]) {
            console.log('moving ' + this.name + ' to ' + this.orders[0]);
            this.move(this.orders.shift());
            return this.orders[0];
        } else {
            return Direction.NONE;
        }
    }

    nextOrder(): Direction {
        return this.orders[0];
    }

    move(direction: Direction) {
        this.setLocation(this.getLocation().ifMovedTo([direction]));
    }

    isBroken(): boolean {
        if (this.nationality === Nationality.GERMAN || this.nationality === Nationality.FINNISH) {
            return this.combatStrength * 2 < this.musterStrength;
        } else {
            return this.combatStrength * 8 < this.musterStrength * 7;
        }
    }

    changeState(newState:UnitState): UnitState {
        this.state = newState;
        if ( newState === UnitState.DEAD ) {
            this.z = -1;
            this.orders = [];
            this.setLocation(Location.DEAD);
            return UnitState.DEAD;
        }
    }


    takeLossAndCheckForDead(lossType: CombatLossType): UnitState {
        this.musterStrength -= lossType;
        this.combatStrength -= lossType * 5;
        if (this.combatStrength < 20) {
            return this.changeState(UnitState.DEAD); 
        } else {
            return UnitState.ACTIVE;
        }
    }

}
