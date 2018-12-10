

export class Terrain {

    armorMovementCost;
    infantryMovementCost;
    defensiveValue;
    offensiveValue;

    constructor(iCost,aCost,defense,offense) {
        this.armorMovementCost = aCost;
        this.infantryMovementCost = iCost;
        this.defensiveValue = defense;
        this.offensiveValue = offense;
    }

    static CLEAR = new Terrain(6,4,2,1);
    static RIVER = new Terrain(14,13,1,2);
    static FOREST = new Terrain(12,8,3,1);
    static CITY = new Terrain(18,6,3,1);
    static SWAMP = new Terrain(18,18,2,1);
    static COAST = new Terrain(8,3,1,2);
    static SEA = new Terrain(1,1,1,1,);


}