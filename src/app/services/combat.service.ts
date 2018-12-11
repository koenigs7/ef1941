import { UnitComponent } from '../units/unit/unit.component';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { UnitService } from './unit.service';


@Injectable()
export class CombatService {

    constructor(private mapService: MapService, private unitService: UnitService) {}

    private SUBTURNS = 32;
    private combatInProgress = false;

    public async startCombat() {
        if ( this.combatInProgress ) {
            return;
        }
        this.combatInProgress = true;

        this.unitService.units.forEach((unit: UnitComponent) => {
            console.log(unit.orders);
            const move = unit.orders[0];
            if ( move ) {
                
                    unit.turnToMove = this.mapService.getTerrainWithDirection(unit.x,unit.y,move).armorMovementCost;
                    console.log(unit.name + " will move on turn "+unit.turnToMove+" to "+JSON.stringify(this.mapService.getTerrainWithDirection(unit.x,unit.y,move))); 
            } else {
                unit.turnToMove = this.SUBTURNS+1;
            }
        });


        for ( let turn = 1 ; turn <= this.SUBTURNS ; turn++ ) {
            this.unitService.units.forEach(unit => {
                if ( unit.turnToMove === turn ) {
                    const move = unit.nextOrder();
                    if ( move ) { 
                        let xy = unit.calculatePositionUsingOrders([move]); 
                        if ( this.unitService.unitAt(xy[0],xy[1] )) {
                            console.log(xy + " is occupied");
                             unit.turnToMove += 2; 
                        } else {
                            unit.moveByOrders();
                            unit.turnToMove = turn + this.mapService.getTerrainWithDirection(unit.x,unit.y,move).armorMovementCost;
                            console.log(unit.name + " moving on turn "+unit.turnToMove+" to "+JSON.stringify(this.mapService.getTerrainWithDirection(unit.x,unit.y,move)));
                        }
                    } else {
                        console.log(unit.name+" out of orders");
                    }
                }
            });
            await new Promise((resolve, reject) => setTimeout(resolve, 200));
            console.log(turn);

        }
        this.combatInProgress = false;
    }


}