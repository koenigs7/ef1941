import { Direction } from './direction';
import { getLocaleCurrencyName } from '@angular/common';


export class Location {

    constructor(public x: number, public y: number) { }

    toString() {
        return '[' + this.x + ',' + this.y + ']';
    }


    distanceTo(loc: Location): number {
        return Math.sqrt(Math.pow(this.x - loc.x, 2) + Math.pow(this.y - loc.y, 2));
    }

    directionTo(loc:Location): Direction { 
        const difX = loc.x - this.x;
        const difY = loc.y - this.y; 
        if ( difX > 0) {
            if ( difX >= Math.abs(difY)) {
                return Direction.EAST;
            } else return difY > 0 ? Direction.SOUTH : Direction.NORTH;
        } else {
            if ( -difX >= Math.abs(difY)) {
                return Direction.WEST;
            } else return difY > 0 ? Direction.SOUTH : Direction.NORTH;
        }
    }

    ifMovedTo(directions: Direction[]): Location {
        let newLocation = new Location(this.x, this.y);
        directions.forEach(direction => {
            newLocation = newLocation.offsetBy(direction);
        });
        return newLocation;
    }

    isValid() {
        return this.x >= 0 && this.x <= 45 && this.y >= 0 && this.y <= 37;
    }


    offsetBy(direction: Direction): Location {
        let x = this.x;
        let y = this.y;
        switch (direction) {
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
        return new Location(x, y);
    }


}