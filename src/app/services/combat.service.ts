import { UnitComponent } from '../units/unit/unit.component';



export class CombatService {

    private SUBTURNS = 32;
    private combatInProgress = false;

    units: UnitComponent[] = [];

    addUnit(u: UnitComponent) {
        this.units.push(u);
    }

    removeUnit(u:UnitComponent) {
        //this.units.
    }

    public async startCombat() {
        if ( this.combatInProgress ) {
            return;
        }
        this.combatInProgress = true;

        this.units.forEach(unit => {
            console.log(unit.orders);
            const move = unit.orders[0];
            if ( move ) {
                unit.turnToMove = 4;
            } else {
                unit.turnToMove = this.SUBTURNS+1;
            }
        });


        for ( let turn = 1 ; turn <= this.SUBTURNS ; turn++ ) {
            this.units.forEach(unit => {
                if ( unit.turnToMove === turn ) {
                    console.log('moving on turn '+turn);
                    const nextMove = unit.moveByOrders();
                    if ( nextMove ) {
                        unit.turnToMove = turn + 4;
                    }
                }
            });
            await new Promise((resolve, reject) => setTimeout(resolve, 200));


        }
        this.combatInProgress = false;
    }


}