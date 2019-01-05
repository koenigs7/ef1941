import { UnitComponent, Nationality } from '../units/unit/unit.component';
import { UnitService } from './unit.service';
import { Injectable } from '@angular/core';
import { Location } from '../model/location';
import { Direction } from '../model/direction';

@Injectable()
export class SupplyService {

    zocMap: Map<String, Number>;

    constructor(private unitService: UnitService) {

    }

    calculateSupply() {
        this.zocMap = this.unitService.createZOCmap(Nationality.RUSSIAN);

        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality !== Nationality.RUSSIAN) {
                this.zocMap.set(unit.getLocation().toString(),0);
            }
        });
        console.log(this.zocMap);
        this.unitService.units.forEach((unit: UnitComponent) => {
            if (unit.nationality !== Nationality.RUSSIAN) { 
                if ( unit.name === '46 Panzer Corps') {
                    console.log('calculating suppy for 46');

                    const location = unit.getLocation();
                    const inSupply = this.checkSupplyRoute(location, 100);
                    console.log(inSupply);
                }
            }
        });

    }

    checkSupplyRoute(location:Location, percent: number): number {
        if ( location.x < 1 ) return percent;
        const west = location.ifMovedTo([Direction.WEST]);
        if ( west.isValid() && this.zocMap.get(west.toString()) !== 1 ) {
            return this.checkSupplyRoute(west, percent-1);
        }
        const nwest = location.ifMovedTo([Direction.WEST,Direction.NORTH]);
        if ( nwest.isValid() &&  this.zocMap.get(nwest.toString()) !== 1 ) {
            return this.checkSupplyRoute(nwest, percent-2);
        }
        const swest = location.ifMovedTo([Direction.WEST,Direction.SOUTH]);
        if ( swest.isValid() && this.zocMap.get(swest.toString()) !== 1 ) {
            return this.checkSupplyRoute(swest, percent-2);
        }
        // console.log(west+','+nwest+','+swest+' blocked');
        return 0;
    }

}