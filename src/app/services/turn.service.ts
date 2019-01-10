import { UnitComponent, UnitState } from '../units/unit/unit.component';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { UnitService } from './unit.service';
import { CombatService } from './combat.service';
import { SupplyService } from './supply.service';


@Injectable()
export class TurnService {

    constructor(private mapService: MapService, private unitService: UnitService,
        private supplyService: SupplyService, private combatService: CombatService) { }

    private SUBTURNS = 32;
    private combatInProgress = false;
    private turnNumber = 0;

    public async startCombat() {
        if (this.combatInProgress) {
            return;
        }
        this.combatInProgress = true;

        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.state === UnitState.ACTIVE) {
                const location = unit.getNextMoveLocation();
                if (location && location.isValid()) {
                    unit.turnToMove = this.mapService.getTerrain(location).movementCost(unit.type);
                    console.log(unit.name + ' will move on turn ' + unit.turnToMove);
                    const unitInWay = this.unitService.unitAt(location);
                    if (unitInWay) {
                        unit.turnToMove = 1;
                    }
                } else {
                    unit.clearOrders();
                }

            }
        });


        for (let turn = 1; turn <= this.SUBTURNS; turn++) {
            this.unitService.units.forEach(unit => {
                if (unit.turnToMove === turn) {
                    const location = unit.getNextMoveLocation();
                    if (location && location.isValid()) {
                        const unitInWay = this.unitService.unitAt(location);
                        if (unitInWay) {
                            if (unitInWay.nationality === unit.nationality) {
                                console.log(location + ' is occupied by friendly');
                                unit.turnToMove += 2;
                            } else {
                                console.log('Combat');
                                this.combatService.resolve(unit, unitInWay);
                                unit.turnToMove += 1;
                            }
                        } else {
                            unit.moveByOrders();
                            const nextlocation = unit.getNextMoveLocation();
                            if (nextlocation && nextlocation.isValid()) {
                                unit.turnToMove += this.mapService.getTerrain(nextlocation).movementCost(unit.type);
                                console.log(unit.name + ' will move on turn ' + unit.turnToMove);
                            } else {
                                unit.clearOrders();
                            }
                        }
                    } else {
                        unit.clearOrders();
                        console.log(unit.name + ' out of orders');
                    }
                }
            });
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
            console.log(turn);

        }
        this.supplyService.calculateSupply();
        this.turnNumber++;
        // Activate Reserves
        this.unitService.units.forEach(unit => {
            if (+unit.arrive === this.turnNumber) {
                const unitInWay = this.unitService.unitAt(unit.getLocation());
                if (unitInWay && unitInWay.name !== unit.name) {
                    unit.arrive++;
                    console.log('reserve blocked ' + unit.name);
                } else {
                    unit.changeState(UnitState.ACTIVE);
                }
            }
        });
        this.combatInProgress = false;
    }


}
