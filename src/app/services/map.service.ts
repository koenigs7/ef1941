import { Injectable } from '@angular/core';
import { Terrain } from '../model/terrain';
import { Direction } from '../model/direction';
import { Location } from '../model/location';


@Injectable()
export class MapService {


    eightZeros = [0,0,0,0,0,0,0,0];
    sevenZeros = [0,0,0,0,0,0,0];

    theMap = [
        [200,200,200,169,0,0,0,0,0,0,0,0,180,200,200,170].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,175,178,0,0,0,181,182,184,183,189,179,187,176].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,200,175,184,183,185,200,200,177,176,71,157,155].concat(this.eightZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,200,200,177,172,173,174,187,188,164,141,148,140].concat(this.eightZeros).concat([157,165,0,156,160,162,166,0]).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,200,200,171,0,0,0,186,178,152,142,149,1,5,0,0,0,0,0,0,0,148,145,161,154,0,0,146,159,165,0,0,0,0,156,164,0].concat(this.sevenZeros),
        [200,200,200,200,200,170,0,0,0,180,170,147,140,150,2,6,0,0,0,0,0,0,0,151,0,0,0,0,0,0,156,168,72,0,157,161,153,145,160,165,0,0,0,0,0,0],
        [200,200,200,200,200,175,178,0,0,190,176,149,139,151,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,145,160,159,155,0,0,0,73,146,166,0,0,0,0,0],
        [200,200,200,200,200,200,169,0,0,0,0,0,0,152,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,157,154,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0],
        [200,200,177,192,200,200,170,72,0,0,0,0,0,148,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,150,0,0,0,0,0,0,0,0,0,0,144,162,159,167,0,0],
        [200,200,170,190,179,173,188,159,160,165,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,151,0,0,0,0,0,0,0,0,0,0,0,0,156,153,0,0],
        [200,200,169,0,0,0,0,0,0,143,164,0,0,0,0,0,157,155,0,0,0,73,0,0,0,74,0,0,156,153,0,0,0,0,0,0,0,0,0,0,0,0,149,0,0,0],
        [200,200,171,0,0,0,0,0,0,0,144,161,166,0,0,156,154,0,0,0,0,0,3,6,0,0,0,0,152,0,0,0,0,0,0,0,0,0,0,0,0,0,147,0,0,0],
        [200,200,175,178,0,0,0,0,0,0,0,0,145,162,163,153,0,0,0,2,151,4,1,2,158,163,161,159,155,0,0,0,0,0,0,0,0,0,0,0,0,0,150,0,0,0],   // BYTE 3800
        [200,200,200,170,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,162,153,0,3,4,148,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,154,0,0,0],
        [200,200,177,188,160,159,161,164,0,0,0,2,6,5,0,0,157,163,154,71,0,1,6,0,147,0,0,152,0,0,0,0,0,0,0,0,0,0,0,0,0,151,74,0,0,0],
        [200,177,176,0,0,0,0,145,162,0,1,4,3,1,0,158,155,0,0,0,0,0,0,0,0,0,0,151,0,0,0,0,0,0,0,0,0,0,0,0,0,148,0,0,0,0],
        [173,176,0,0,0,0,0,0,0,0,2,6,74,0,140,150,139,0,0,0,0,0,0,0,0,0,0,143,162,167,0,0,0,0,0,0,0,0,0,0,158,155,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,3,5,0,0,0,142,144,165,141,0,0,0,0,0,0,71,0,0,0,0,150,73,0,0,0,0,0,0,0,0,0,152,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,6,0,0,0,0,141,139,142,146,167,0,0,0,0,0,0,0,0,0,0,0,145,165,0,0,0,0,0,0,0,0,0,150,0,0,0,0,0],
        [166,73,0,0,0,0,0,5,4,0,0,139,140,142,141,140,0,152,0,0,0,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0],
        [146,165,0,0,0,0,0,3,1,0,0,141,159,163,165,142,139,148,0,0,0,0,0,0,0,150,0,0,0,0,144,161,164,0,0,0,0,0,0,0,151,0,0,0,0,0],  // BYTE 4260
        [0,143,167,0,0,0,3,4,6,0,139,140,142,141,145,160,166,151,0,0,0,0,0,0,0,145,166,0,0,0,0,0,146,166,0,0,0,0,0,0,148,0,0,0,0,0],
        [0,0,149,0,0,0,2,5,139,142,141,139,140,139,142,140,146,168,0,0,0,0,0,0,0,0,151,0,0,0,0,0,0,143,163,159,161,160,166,0,152,0,0,0,0,0],
        [0,156,154,0,0,0,0,0,140,139,141,142,140,0,0,0,139,148,0,0,0,0,0,0,0,74,148,0,0,0,0,0,0,0,0,0,0,0,147,71,143,159,160,162,165,0],
        [153,151,0,0,0,0,0,0,0,142,0,0,0,0,0,0,71,149,0,0,0,0,0,0,0,0,144,165,0,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0,144,166], // Southern map
        [1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,143,156,161,0,0,0,0,0,0,0,146,156,155,157,154,156,160,0,0,0,0,148,0,0,0,0,0,0,146],
        [2,5,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,145,155,158,0,0,0,0,0,0,0,0,0,0,0,145,157,158,0,152,150,0,0,0,0,0,0,0],
        [0,0,1,5,6,3,0,0,156,161,0,0,0,156,159,0,0,0,0,0,0,144,154,160,0,0,0,0,0,0,0,0,0,0,153,162,155,151,0,0,0,0,0,0,0,0],
        [0,0,0,0,4,3,1,5,0,145,159,0,0,0,146,157,158,0,0,0,0,0,0,146,157,159,0,0,0,0,0,0,0,152,151,0,0,0,0,0,0,0,0,0,0,0,],
        [0,0,0,0,0,2,4,6,0,0,143,155,156,154,160,0,143,154,161,0,0,0,0,0,0,143,158,0,0,0,0,0,153,150,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,3,5,0,0,0,0,0,144,158,0,0,145,160,0,0,0,0,0,72,147,0,0,0,176,165,188,73,0,0,0,0,0,0,0,0,0,0,0,0], // BYTE 4870
        [0,0,0,0,0,0,0,2,6,4,0,0,0,0,0,146,161,0,0,144,159,0,0,0,0,153,150,0,177,166,170,178,174,0,0,0,0,0,0,0,0,0,0,0,0,0,],
        [0,0,0,0,0,0,0,0,5,1,6,0,160,0,0,0,143,159,0,0,146,158,0,0,0,149,0,175,171,200,179,173,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,2,4,3,144,161,0,0,0,145,160,73,0,147,0,0,152,151,0,164,200,200,168,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,5,3,6,2,1,143,159,0,0,0,146,186,165,187,166,167,188,182,172,200,200,200,178,174,0,74,152,154,157,156,159,0,0,0,0,0,0,0],
        [0,0,4,5,1,5,2,3,6,1,4,5,6,2,145,158,0,0,176,170,200,200,200,178,173,183,184,184,185,163,181,153,157,155,150,0,0,0,148,0,0,0,0,0,0,0],
        [0,0,5,3,6,4,1,4,2,0,3,4,1,6,0,146,186,167,171,200,200,200,200,168,180,0,0,176,170,200,169,187,166,167,180,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177,172,200,200,200,200,200,200,200,169,181,175,171,200,200,200,200,200,200,169,165,181,5,4,2,3,6,1,6,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,164,200,200,200,200,200,200,200,200,200,168,172,200,200,200,200,200,200,200,200,200,168,166,167,181,1,2,3,4,3,3]

    ];

    getTheMap(): number[][] {
        return this.theMap;
    }

    getTerrain(location:Location) {
        return this.getTerrainAt(location.x, location.y);
    }

    
    getTerrainAt(x:number,y:number): Terrain {
        const terrainCode = this.theMap[y][x];
        // console.log('Terrain at '+x+','+y+'='+terrainCode);
        if ( terrainCode === 0 ) {
            return Terrain.CLEAR;
        } else if ( terrainCode >= 1 && terrainCode <= 6 ) {
            return Terrain.FOREST;
        } else if ( terrainCode >= 71 && terrainCode <= 74 ) {
            return Terrain.CITY;
        } else if ( terrainCode >= 139 && terrainCode <= 142 ) {
            return Terrain.SWAMP;
        } else if ( terrainCode >= 143 && terrainCode <= 168 ) {
            return Terrain.RIVER;
        } else if ( terrainCode >= 169 && terrainCode <= 199 ) {
            return Terrain.COAST;
        } else if ( terrainCode === 200) {
            return Terrain.SEA; 
        } else {
            console.log('unmapped code : '+ terrainCode);
        }
    }

}
