

export class Terrain {

    armorMovementCost;
    infantryMovementCost;

    constructor(aCost,iCost) {
        this.armorMovementCost = aCost;
        this.infantryMovementCost = iCost;
    }

    static CLEAR = new Terrain(4,6);
    static RIVER = new Terrain(8,10);


}