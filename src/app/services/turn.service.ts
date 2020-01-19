import { UnitComponent } from '../units/unit/unit.component';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { UnitService } from './unit.service';
import { CombatService } from './combat.service';
import { SupplyService } from './supply.service';
import { AIService } from './ai.service'; 
import { HeaderComponent } from '../header/header.component';
import { Nationality, UnitState, Alliance } from '../units/unit/unit.enums';
import { ScoreService } from './score.service';


@Injectable()
export class TurnService {

    constructor(private mapService: MapService, private unitService: UnitService, private aiService: AIService,
        private scoreService: ScoreService,
        private supplyService: SupplyService, private combatService: CombatService) { }

    private SUBTURNS = 32;
    private combatInProgress = false;
    private turnNumber = 0;

    public async startCombat() {
        if (this.combatInProgress) {
            return;
        }
        this.combatInProgress = true; 

        this.unitService.units.filter(UnitService.activeUnitsFilter).forEach((unit: UnitComponent) => {
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
        });


        for (let turn = 1; turn <= this.SUBTURNS; turn++) {
            this.unitService.units.filter(UnitService.activeUnitsFilter).forEach(unit => {
                if (unit.turnToMove === turn) {
                    const location = unit.getNextMoveLocation();
                    if (location && location.isValid()) {
                        const unitInWay = this.unitService.unitAt(location);
                        if (unitInWay) {
                            if (unitInWay.nationality === unit.nationality) {
                                console.log(location + ' is occupied by friendly');
                                unit.turnToMove += 2;
                            } else {
                                console.log('Combat for ' + unit.name + ' and ' + unitInWay.name);
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
        // Activate Reserves
        this.unitService.units.forEach(unit => {
            if (+unit.arrive === this.turnNumber && unit.state !== UnitState.DEAD) {
                const unitInWay = this.unitService.unitAt(unit.getLocation());
                if (unitInWay && unitInWay.name !== unit.name) {
                    unit.arrive++;
                    console.log('reserve blocked ' + unit.name);
                } else {
                    unit.changeState(UnitState.ACTIVE);
                }
            }
        }); 
        this.supplyService.calculateSupply();
        const score = this.scoreService.calculateScore() + this.mapService.getGermanCityScore();
        this.turnNumber++;
        this.aiService.startAI(Alliance.ALLIES);
        this.combatInProgress = false; 
        HeaderComponent.incrementDate();
        HeaderComponent.setScore(score);
    }


}
