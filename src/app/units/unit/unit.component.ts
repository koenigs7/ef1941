import { Component, OnInit, Input } from '@angular/core';
import { Direction } from 'src/app/model/direction';
import { Location } from 'src/app/model/location';
import { AudioService } from 'src/app/services/audio.service';
import { HeaderComponent } from 'src/app/header/header.component';
import { Alliance, UnitState, Nationality, UnitType, CombatLossType} from './unit.enums';
import { MapService } from 'src/app/services/map.service';
import { Terrain } from 'src/app/model/terrain';

const ImageMap = {
    'G': ['grey.png', 'greyi.png'],
    'R': ['red.png', 'redi.png'],
    'F': ['white.png', 'white.png'],
    'O': ['green.png', 'green.png'],
    'H': ['green.png', 'green.png'],
    'I': ['green.png', 'green.png']
};

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

    static allUnits: UnitComponent[] = [];

    static SELECTED_BORDER_WIDTH = 5;
    static Selected: UnitComponent = null;

    @Input() x: number;
    @Input() y: number;
    @Input() name: string;
    @Input() nationality: Nationality;
    @Input() musterStrength: number;
    @Input() arrive: number;

    public combatStrength: number;
    public screenX: number;
    public screenY: number;
    public z = 2;
    private selected = false;
    public orders: Direction[] = [];
    public supplyPath: Location[] = [];
    public turnToMove = 0;
    public type: UnitType;
    public state: UnitState;
    public imageSrc: string;
    public supplyPercent = '100';

    private armorNames = ['Panzer','Tank','Cav'];

    static ClearSelected() {
        if ( UnitComponent.Selected ) {
            UnitComponent.Selected.clearFocus();
        }
        UnitComponent.Selected = null;
    }

    static AddOrder(direction: Direction) {
        if ( UnitComponent.Selected && UnitComponent.Selected.orders.length < 10 ) { 
            UnitComponent.Selected.addOrder(direction);
        }
    }

    static ClearOrders() {
        if ( UnitComponent.Selected ) {
            UnitComponent.Selected.clearOrders();
        }
    }

    constructor(private audioService: AudioService, private mapService: MapService) {
        UnitComponent.allUnits.push(this);
    }


    ngOnInit() {
        this.type = this.armorNames.find(name => this.name.includes(name)) ? UnitType.ARMOR : UnitType.INFANTRY;
        this.imageSrc = 'assets/images/units/' + ImageMap[this.nationality][this.type.valueOf()];
        this.state = +this.arrive === 0 ? UnitState.ACTIVE : UnitState.RESERVE;
        this.combatStrength = +this.musterStrength;
        this.setLocation(new Location(45 - this.x, 38 - this.y)); // CC used a 0,0 bottom right.. I'm using 0,0 top left
    }

    public setFocus() {
        if ( this.selected ) {
            this.clearFocus();
        } else {
            if ( UnitComponent.Selected) UnitComponent.Selected.clearFocus();
            this.screenX -= UnitComponent.SELECTED_BORDER_WIDTH;
            this.screenY -= UnitComponent.SELECTED_BORDER_WIDTH;
            this.selected = true;
            this.z = 4;
            UnitComponent.Selected = this;
        }
    }

    public clearFocus(): void {
        this.screenX += UnitComponent.SELECTED_BORDER_WIDTH;
        this.screenY += UnitComponent.SELECTED_BORDER_WIDTH;
        this.z = 2;
        this.selected = false;
        UnitComponent.Selected = null;
    }

    public setLocation(location: Location): void {
        this.x = location.x;
        this.y = location.y;
        this.screenX = this.x * 40 + 13;
        this.screenY = this.y * 40 + 13 + 20;
        // console.log('setting location to ' + location);
    }

    public getLocation(): Location {
        return new Location(this.x, this.y);
    }


    clearOrders(): void {
        this.orders = [];
    }

    moveByOrders(): Direction {
        if (this.orders[0]) {
            console.log('moving ' + this.name + ' to ' + this.orders[0]);
            if ( this.combatStrength > 10 ) {
                this.combatStrength -= 5;
            }
            this.move(this.orders.shift());
            return this.orders[0];
        } else {
            return Direction.NONE;
        }
    }

    getNextMoveLocation(): Location {
        const move = this.nextOrder();
        if (move) {
            const nextLocation =  this.getLocation().ifMovedTo(move);
            return nextLocation.isValid() ? nextLocation : null;
        }
        return null;
    }

    nextOrder(): Direction {
        return this.orders[0];
    }

    addOrder(direction:Direction):void {
        const currentLocation = this.getLocation().ifMovedTo(...this.orders);
        this.orders.push(direction);
        const location = this.getLocation().ifMovedTo(...this.orders);
        const validPath = this.mapService.checkPath(currentLocation,location);
        if ( !validPath || !location.isValid() || this.mapService.getTerrain(location) === Terrain.SEA ) {
            this.orders.pop();
            this.audioService.dead();
        } else {
            this.audioService.move();
        }
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

    isMilitia() {
        return this.name.toLowerCase().includes('militia');
    }

    getAlliance(): Alliance {
        return this.nationality === Nationality.RUSSIAN ? Alliance.ALLIES : Alliance.AXIS;
    }

    changeState(newState: UnitState): UnitState {
        this.state = newState;
        console.log(this.name + '=>' + this.state);
        if (newState === UnitState.DEAD) {
            this.orders = [];
            this.audioService.dead();
            HeaderComponent.incrementLosses(this.getAlliance()); 
            return UnitState.DEAD;
        }
        if (newState === UnitState.RESERVE) {
            return UnitState.RESERVE;
        }
        if (newState === UnitState.ACTIVE) {
            return UnitState.ACTIVE;
        }
    }


    takeLossAndCheckForDead(lossType: CombatLossType): UnitState {
        this.musterStrength -= lossType;
        this.combatStrength -= lossType * 5;
        if (this.combatStrength < 10) {
            this.changeState(UnitState.DEAD);
            return UnitState.DEAD;
        } else {
            return UnitState.ACTIVE;
        }
    }

    getArrowLocation(index: number): Location {
        const location = new Location(this.x, this.y).ifMovedTo(...this.orders.slice(0, index + 1));
        return new Location(location.x * 40 + 13, location.y * 40 + 13 + 20);
    }

    getSupplyLocation(index: number): Location {
        const location =  this.supplyPath[index];
        return new Location(location.x * 40 + 13, location.y * 40 + 13 + 20);
    }

    getArrowRotation(index: number): number {
        switch (this.orders[index]) {
            case Direction.EAST:
                return 0;
            case Direction.NORTH:
                return -90;
            case Direction.SOUTH:
                return 90;
            case Direction.WEST:
                return 180;
        }
    }

}
