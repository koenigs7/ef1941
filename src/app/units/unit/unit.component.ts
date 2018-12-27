import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/move.service';
import { MapService } from 'src/app/services/map.service';
import { UnitService } from 'src/app/services/unit.service';
import { Direction } from 'src/app/model/direction';
import { Location } from 'src/app/model/location';
import { Terrain } from 'src/app/model/terrain';

export enum Nationality {
    GERMAN = 'G',
    RUSSIAN = 'R',
    FINNISH = 'F',
    HUNGARIAN = 'H',
    ROMAINIAN = 'O',
    ITALIAN = 'I'
}

const ImageMap = {
    'G' : ['grey.png','greyi.png'],
    'R' : ['red.png','redi.png'],
    'F' : ['white.png','white.png'],
    'O' : ['green.png','green.png'],
    'H' : ['green.png','green.png'],
    'I' : ['green.png','green.png']
};

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
    @Input() arrive: number;

    public combatStrength;
    public screenX;
    public screenY;
    public z = 2;
    public selected = false;
    public orders: Direction[] = [];
    public turnToMove = 0;
    public type: UnitType;
    public state:UnitState = UnitState.ACTIVE;
    public imageSrc:string;

    constructor(private moveService: OrderService, private unitService: UnitService) {
        this.unitService.addUnit(this);
    }


    ngOnInit() { 
        this.type = this.name.includes('Panzer') || this.name.includes('Tank') ? UnitType.ARMOR :UnitType.INFANTRY;
        this.imageSrc = 'assets/images/units/' + ImageMap[this.nationality][this.type.valueOf()];
        this.combatStrength = this.musterStrength;
        this.setLocation(new Location(45-this.x, 38-this.y)); // CC used a 0,0 bottom right.. I'm using 0,0 top left
        this.moveService.orders.subscribe(direction => {
            if (direction && this.selected) {
                this.orders.push(direction);
            }
        });
        this.moveService.focused.subscribe(unit => {
            if (this === unit && !this.selected) {
                this.screenX -= UnitComponent.SELECTED_BORDER_WIDTH;
                this.screenY -= UnitComponent.SELECTED_BORDER_WIDTH;
                this.selected = true;
                this.z = 4;
            } else if (this.selected === true) {
                this.screenX += UnitComponent.SELECTED_BORDER_WIDTH;
                this.screenY += UnitComponent.SELECTED_BORDER_WIDTH;
                this.selected = false;
                this.z = 2;
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

    // getTerrain(): Terrain {
    //     return this.mapService.getTerrainAt(this.x, this.y);
    // }

    clicked() {
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
        this.setLocation(this.getLocation().offsetBy(direction));
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
