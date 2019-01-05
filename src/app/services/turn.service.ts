import { UnitComponent } from '../units/unit/unit.component';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { UnitService } from './unit.service';
import { CombatService } from './combat.service';
import { SupplyService } from './supply.service';


@Injectable()
export class TurnService {

    constructor(private mapService: MapService, private unitService: UnitService,
        private supplyService: SupplyService, private combatService:CombatService) {}

    private SUBTURNS = 32;
    private combatInProgress = false;

    public async startCombat() {
        if ( this.combatInProgress ) {
            return;
        }
        this.combatInProgress = true;

        this.unitService.units.forEach((unit: UnitComponent) => {
            const move = unit.orders[0];
            if ( move ) {
                    unit.turnToMove = this.mapService.getTerrainWithDirection(unit.x,unit.y,move).movementCost(unit.type);
                    console.log(unit.name + ' will move on turn ' + unit.turnToMove+' to '+
                        JSON.stringify(this.mapService.getTerrainWithDirection(unit.x,unit.y,move))); 
            } else {
                unit.turnToMove = this.SUBTURNS+1;
            }
        });


        for ( let turn = 1 ; turn <= this.SUBTURNS ; turn++ ) {
            this.unitService.units.forEach(unit => {
                if ( unit.turnToMove === turn ) {
                    const move = unit.nextOrder();
                    if ( move ) { 
                        const location = unit.getLocation().ifMovedTo([move]); 
                        const unitInWay = this.unitService.unitAt(location);
                        if ( unitInWay  ) {
                            if ( unitInWay.nationality === unit.nationality ) {
                                console.log(location + ' is occupied by friendly');
                                 unit.turnToMove += 2; 
                            } else  {
                                console.log('Combat');
                                this.combatService.resolve(unit,unitInWay);
                                unit.turnToMove += 1;
                            }
                        } else {
                            unit.moveByOrders();
                            unit.turnToMove = turn + this.mapService.getTerrainWithDirection(unit.x,unit.y,move).movementCost(unit.type);
                            console.log(unit.name + ' moving on turn '+unit.turnToMove+' to '+
                                JSON.stringify(this.mapService.getTerrainWithDirection(unit.x,unit.y,move)));
                        }
                    } else {
                        console.log(unit.name+' out of orders');
                    }
                }
            });
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
            console.log(turn);

        }
        this.supplyService.calculateSupply();
        this.combatInProgress = false;
    }


}
