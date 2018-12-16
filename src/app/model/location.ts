import { Direction } from './direction';
import { Direct } from 'protractor/built/driverProviders';


export class Location {

    static DEAD = new Location(-1, -1);

    constructor(public x: number, public y: number) { }

    toString() {
        return '[' + this.x + ',' + this.y + ']';
    }

    ifMovedTo(directions: Direction[]): Location {
        let newLocation = new Location(this.x, this.y);
        directions.forEach(direction => {
            newLocation = newLocation.offsetBy(direction);
        });
        return newLocation;
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