import { Direction } from './direction';
import { getLocaleCurrencyName } from '@angular/common';
import { Direct } from 'protractor/built/driverProviders';


export class Location {

    previous: Location; // For constructing paths

    constructor(public x: number, public y: number) { }

    toString() {
        return '[' + this.x + ',' + this.y + ']';
    }

    equals(loc: Location): boolean {
        if ( loc == null ) return false;
        return this.x === loc.x && this.y === loc.y;
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

    ifMovedTo(...directions: Direction[]): Location {
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

    
    supplyNeighborSquares(supplyDirection: Direction): Location[] {
        const neighbors = [];

        if ( supplyDirection === Direction.WEST ) {
            let loc = this.ifMovedTo(Direction.WEST);
            if ( loc.isValid()) neighbors.push(loc);
            loc = this.ifMovedTo(Direction.WEST,Direction.NORTH);
            if ( loc.isValid()) neighbors.push(loc);
            loc = this.ifMovedTo(Direction.WEST,Direction.SOUTH);
            if ( loc.isValid()) neighbors.push(loc);
        }
        if ( supplyDirection === Direction.EAST ) {
            let loc = this.ifMovedTo(Direction.EAST);
            if ( loc.isValid()) neighbors.push(loc);
            loc = this.ifMovedTo(Direction.EAST,Direction.NORTH);
            if ( loc.isValid()) neighbors.push(loc);
            loc = this.ifMovedTo(Direction.EAST,Direction.SOUTH);
            if ( loc.isValid()) neighbors.push(loc);
        }
        return neighbors;
    }

    
    getPath(): Location[] {
        const locs = [];
        let current:Location = this;
        while ( current ) {
            locs.push(current);
            current = current.previous;
        }
        return locs;
    }

}