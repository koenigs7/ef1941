import { UnitComponent } from '../units/unit/unit.component';
import { UnitService } from './unit.service';
import { Injectable } from '@angular/core';
import { Location } from '../model/location';
import { Direction } from '../model/direction';
import { MapService } from './map.service';
import { Terrain } from '../model/terrain';
import { Alliance, Nationality } from '../units/unit/unit.enums';

@Injectable()
export class SupplyService {

    zocMap: Map<String, Number>;

    constructor(private unitService: UnitService, private mapServie: MapService) {

    }

    calculateSupply() {
        // Calculate Axis supply.  Create Allies ZOC map, remove ZOC where Axis are, then check for route
        this.zocMap = this.unitService.createZOCmap(Alliance.ALLIES);
        this.unitService.activeAxis().forEach(unit => {
            this.zocMap.set(unit.getLocation().toString(), 0);
        });
        console.log('alliesZocMap', this.zocMap);
        this.unitService.activeAxis().forEach(unit => {
            unit.supplyPath = [];
            let supplyPercent: number = this.checkSupplyRoute(unit, unit.getLocation(), 100, Direction.WEST);
            if (supplyPercent === 0) {
                console.log(unit.name + ' out of supply');
                unit.combatStrength -= Math.round(unit.combatStrength / 3);
            } else {
                supplyPercent = Math.min(supplyPercent, 100);
            }
            if ( supplyPercent < 50 && this.mapServie.isCity(unit.x, unit.y)) {
                supplyPercent = 50;
                console.log('city increased supply',unit.name);
            }
            if ( supplyPercent > 0 ) {
                unit.combatStrength = +unit.combatStrength + Math.round((unit.musterStrength - unit.combatStrength) * supplyPercent / 150);
            }
            unit.supplyPercent = supplyPercent + '';
        });

        // Calculate Allird supply.  Create Axis ZOC map, remove ZOC where Allies are, then check for route
        this.zocMap = this.unitService.createZOCmap(Alliance.AXIS);
        this.unitService.activeAllies().forEach(unit=> { 
                this.zocMap.set(unit.getLocation().toString(), 0); 
        });
        console.log('axisZocMap', this.zocMap);
        this.unitService.activeAllies().forEach(unit=> { 
                unit.supplyPath = [];
                let supplyPercent = this.checkSupplyRoute(unit, unit.getLocation(), 120, Direction.EAST);
                if (supplyPercent === 0) {
                    console.log(unit.name + ' out of supply');
                    unit.clearOrders();
                    for ( let i = 0 ; i < 5 ; i++ ) {
                        unit.addOrder(Direction.EAST);
                    }
                    unit.combatStrength -= Math.round(unit.combatStrength / 3);
                }
                if ( supplyPercent < 75 && this.mapServie.isCity(unit.x, unit.y)) {
                    supplyPercent = 75;
                    unit.clearOrders();
                    console.log('city increased supply',unit.name);
                }
                if ( supplyPercent > 0 ) {
                    unit.combatStrength = +unit.combatStrength + Math.round((unit.musterStrength - unit.combatStrength) * supplyPercent / 150);
                }
                unit.supplyPercent = Math.min(100,supplyPercent) + ''; 
        });

    }

    checkSupplyRoute(unit: UnitComponent, location: Location, percent: number, supplyDirection: Direction
    ): number {

        const toVisit: Location[] = [];
        const visited: Location[] = [];
        toVisit.push(location);
        while (toVisit.length) {
            const next = toVisit.shift();
            // console.log(next);
            if (!visited.find(p => p.equals(next))) {
                visited.push(next);
                for (const n of next.supplyNeighborSquares(supplyDirection)) {
                    if (!visited.find(p => p.equals(n)) && !toVisit.find(p => p.equals(n))
                        && n.isValid() && this.zocMap.get(n.toString()) !== 1 
                        && this.mapServie.getTerrain(n) !== Terrain.SEA
                    ) {
                        toVisit.push(n);
                        n.previous = next;
                    }
                }
                // console.log(toVisit);
            }
            if (supplyDirection === Direction.WEST) {
                if (next.x < 1 || (next.y === 0 && next.x < 13 && unit.nationality === Nationality.FINNISH) || 
                    ( next.x === 2 && next.y === 10 ) || ( next.x === 5 && next.y === 5)
                ) {
                    unit.supplyPath = next.getPath();
                    return percent - unit.supplyPath.length;
                }
            }
            if (supplyDirection === Direction.EAST && next.x > 44) {
                unit.supplyPath = next.getPath();
                return percent - unit.supplyPath.length;
            }
        }
        return 0;
    }

}