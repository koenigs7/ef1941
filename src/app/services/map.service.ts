import { Injectable } from "@angular/core";
import { Terrain } from '../model/terrain';
import { Direction } from '../model/direction';


@Injectable()
export class MapService {


    eightZeros = [0,0,0,0,0,0,0,0];
    sevenZeros = [0,0,0,0,0,0,0];

    theMap = [
        [191,191,191,169,0,0,0,0,0,0,0,0,180,191,191,170].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,175,178,0,0,0,181,182,184,183,182,179,187,176].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,191,175,184,183,185,191,191,177,176,71,157,155].concat(this.eightZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,191,191,177,172,173,174,187,188,164,141,148,140].concat(this.eightZeros).concat([157,165,0,156,160,162,166,0]).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,191,191,171,0,0,0,186,178,152,142,149,1,5,0,0,0,0,0,0,0,148,145,161,154,0,0,146,159,165,0,0,0,0,156,164,0].concat(this.sevenZeros),
        [191,191,191,191,191,170,0,0,0,180,170,147,140,150,2,6,0,0,0,0,0,0,0,151,0,0,0,0,0,0,156,168,72,0,157,161,153,145,160,165,0,0,0,0,0,0],
        [191,191,191,191,191,175,178,0,0,0,176,149,139,151,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,145,160,159,155,0,0,0,73,146,166,0,0,0,0,0],
        [191,191,191,191,191,191,169,0,0,0,0,0,0,152,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,157,154,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0],
        [191,191,177,172,191,191,170,72,0,0,0,0,0,148,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,150,0,0,0,0,0,0,0,0,0,0,144,162,159,167,0,0],
        [191,191,170,0,179,173,188,159,160,165,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,151,0,0,0,0,0,0,0,0,0,0,0,0,156,153,0,0],
        [191,191,169,0,0,0,0,0,0,143,164,0,0,0,0,0,157,155,0,0,0,73,0,0,0,74,0,0,156,153,0,0,0,0,0,0,0,0,0,0,0,0,149,0,0,0],
        [191,191,171,0,0,0,0,0,0,0,144,161,166,0,0,156,154,0,0,0,0,0,3,6,0,0,0,0,152,0,0,0,0,0,0,0,0,0,0,0,0,0,147,0,0,0],
        [191,191,175,178,0,0,0,0,0,0,0,0,145,162,163,153,0,0,0,2,151,4,1,2,158,163,161,159,155,0,0,0,0,0,0,0,0,0,0,0,0,0,150,0,0,0],   //BYTE 3800
        [191,191,191,170,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,162,153,0,3,4,148,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,154,0,0,0],
        [191,191,177,188,160,159,161,164,0,0,0,2,6,5,0,0,157,163,154,71,0,1,6,0,147,0,0,152,0,0,0,0,0,0,0,0,0,0,0,0,0,151,74,0,0,0],
        [191,177,176,0,0,0,0,145,162,0,1,4,3,1,0,158,155,0,0,0,0,0,0,0,0,0,0,151,0,0,0,0,0,0,0,0,0,0,0,0,0,148,0,0,0,0],
        [173,176,0,0,0,0,0,0,0,0,2,6,74,0,140,150,139,0,0,0,0,0,0,0,0,0,0,143,162,167,0,0,0,0,0,0,0,0,0,0,158,155,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,3,5,0,0,0,142,144,165,141,0,0,0,0,0,0,71,0,0,0,0,150,73,0,0,0,0,0,0,0,0,0,152,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,6,0,0,0,0,141,139,142,146,167,0,0,0,0,0,0,0,0,0,0,0,145,165,0,0,0,0,0,0,0,0,0,150,0,0,0,0,0],
        [166,73,0,0,0,0,0,5,4,0,0,139,140,142,141,140,0,152,0,0,0,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0],
        [146,165,0,0,0,0,0,3,1,0,0,141,159,163,165,142,139,148,0,0,0,0,0,0,0,150,0,0,0,0,144,161,164,0,0,0,0,0,0,0,151,0,0,0,0,0]  // BYTE 4260
    ];

    getTheMap(): number[][] {
        return this.theMap;
    }

    
    getTerrainAt(x:number,y:number): Terrain {
        const terrainCode = this.theMap[y][x];
        console.log("Terrain at "+x+","+y+"="+terrainCode);
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
        } else if ( terrainCode >= 169 && terrainCode <= 179 ) {
            return Terrain.COAST;
        } else if ( terrainCode === 191 ) {
            return Terrain.SEA; 
        } else {
            console.log("unmapped code : "+ terrainCode);
        }
    }

    getTerrainWithDirection(x,y,direction:Direction): Terrain {
        if ( direction === Direction.NORTH ) return this.getTerrainAt(x,y-1);
        if ( direction === Direction.EAST ) return this.getTerrainAt(x+1,y);
        if ( direction === Direction.SOUTH ) return this.getTerrainAt(x,y+1);
        if ( direction === Direction.WEST ) return this.getTerrainAt(x-1,y);
        console.log("bad direction "+direction);
    }


}