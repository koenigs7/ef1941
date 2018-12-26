import { UnitType } from '../units/unit/unit.component';


export class Terrain {


    static CLEAR = new Terrain(6, 4, 2, 1);
    static RIVER = new Terrain(14, 13, 1, 2);
    static FOREST = new Terrain(12, 8, 3, 1);
    static CITY = new Terrain(18, 6, 3, 1);
    static SWAMP = new Terrain(18, 18, 2, 1);
    static COAST = new Terrain(8, 3, 1, 2);
    static SEA = new Terrain(99, 99, 1, 1);


    private armorMovementCost;
    private infantryMovementCost;
    defensiveValue;
    offensiveValue;

    constructor(iCost, aCost, defense, offense) {
        this.armorMovementCost = aCost;
        this.infantryMovementCost = iCost;
        this.offensiveValue = offense;
        this.defensiveValue = defense;
    }

    movementCost(type: UnitType) {
        return type === UnitType.ARMOR ? this.armorMovementCost : this.armorMovementCost.infantryMovementCost;
    }


}