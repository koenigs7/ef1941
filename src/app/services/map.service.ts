import { Injectable } from '@angular/core';
import { Terrain } from '../model/terrain'; 
import { Location } from '../model/location';
import { Alliance } from '../units/unit/unit.enums';

export interface City {
    x: number;
    y: number;
    points: number;
    owner: Alliance;
    name: string;
}

@Injectable()
export class MapService {

    eightZeros = [0,0,0,0,0,0,0,0];
    sevenZeros = [0,0,0,0,0,0,0];

    theMap = [
        [200,200,200,169,0,0,0,0,0,0,0,0,180,200,200,170].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,191,178,0,0,0,181,182,184,183,189,179,187,176].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,200,191,184,183,185,200,200,193,176,71,157,155].concat(this.eightZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,200,200,193,172,173,174,187,188,164,141,148,140].concat(this.eightZeros).concat([157,165,0,156,160,162,166,0]).concat(this.eightZeros).concat(this.sevenZeros),
        [200,200,200,200,200,171,0,0,0,186,178,152,142,149,1,5,0,0,0,0,0,0,0,148,145,161,154,0,0,146,159,165,0,0,0,0,156,164,0].concat(this.sevenZeros),
        [200,200,200,200,200,170,0,0,0,180,170,147,140,150,2,6,0,0,0,0,0,0,0,151,0,0,0,0,0,0,156,168,72,0,157,161,153,145,160,165,0,0,0,0,0,0],
        [200,200,200,200,200,191,178,0,0,175,176,149,139,151,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,145,160,159,155,0,0,0,73,146,166,0,0,0,0,0],
        [200,200,200,200,200,200,169,0,0,0,0,0,0,152,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,157,154,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0],
        [200,200,193,192,200,200,170,72,0,0,0,0,0,148,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,150,0,0,0,0,0,0,0,0,0,0,144,162,159,167,0,0],
        [200,200,170,175,179,173,188,159,160,165,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,151,0,0,0,0,0,0,0,0,0,0,0,0,156,153,0,0],
        [200,200,169,0,0,0,0,0,0,143,164,0,0,0,0,0,157,155,0,0,0,73,0,0,0,74,0,0,156,153,0,0,0,0,0,0,0,0,0,0,0,0,149,0,0,0],
        [200,200,171,0,0,0,0,0,0,0,144,161,166,0,0,156,154,0,0,0,0,0,3,6,0,0,0,0,152,0,0,0,0,0,0,0,0,0,0,0,0,0,147,0,0,0],
        [200,200,191,178,0,0,0,0,0,0,0,0,145,162,163,153,0,0,0,2,151,4,1,2,158,163,161,159,155,0,0,0,0,0,0,0,0,0,0,0,0,0,150,0,0,0],   // BYTE 3800
        [200,200,200,170,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,162,153,0,3,4,148,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,154,0,0,0],
        [200,200,193,188,160,159,161,164,0,0,0,2,6,5,0,0,157,163,154,71,0,1,6,0,147,0,0,152,0,0,0,0,0,0,0,0,0,0,0,0,0,151,74,0,0,0],
        [200,193,176,0,0,0,0,145,162,0,1,4,3,1,0,158,155,0,0,0,0,0,0,0,0,0,0,151,0,0,0,0,0,0,0,0,0,0,0,0,0,148,0,0,0,0],
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
        [0,0,0,0,0,0,0,2,6,4,0,0,0,0,0,146,161,0,0,144,159,0,0,0,0,153,150,0,177,166,195,198,174,0,0,0,0,0,0,0,0,0,0,0,0,0,],
        [0,0,0,0,0,0,0,0,5,1,6,0,160,0,0,0,143,159,0,0,146,158,0,0,0,149,0,175,196,200,199,173,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,2,4,3,144,161,0,0,0,145,160,73,0,147,0,0,152,151,0,164,200,200,193,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,5,3,6,2,1,143,159,0,0,0,146,186,165,187,166,167,188,182,197,200,200,200,198,174,0,74,152,154,157,156,159,0,0,0,0,0,0,0],
        [0,0,4,5,1,5,2,3,6,1,4,5,6,2,145,158,0,0,176,195,200,200,200,198,173,183,184,184,185,163,181,153,157,155,150,0,0,0,148,0,0,0,0,0,0,0],
        [0,0,5,3,6,4,1,4,2,0,3,4,1,6,0,146,186,167,196,200,200,200,200,193,180,0,0,176,195,200,194,187,166,167,180,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177,197,200,200,200,200,200,200,200,194,181,175,196,200,200,200,200,200,200,194,165,181,5,4,2,3,6,1,6,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,164,200,200,200,200,200,200,200,200,200,193,197,200,200,200,200,200,200,200,200,200,193,166,167,181,1,2,3,4,3,3]

    ];

    badPaths = [
        [7,2,7,3],
        [6,2,6,3],
        [9,5,10,5],
        [11,1,11,2]
    ];

    cities: City[] = [
        { x: 12, y: 2, points : 10000, owner: Alliance.ALLIES, name: 'Leningrad'},
        { x: 32, y: 5, points : 5000, owner: Alliance.ALLIES, name: 'Novgorod'},
        { x: 38, y: 6, points : 5000, owner: Alliance.ALLIES, name: 'Kazan'},
        { x: 7, y: 8, points : 5000, owner: Alliance.ALLIES, name: 'Riga'},
        { x: 21, y: 10, points : 5000, owner: Alliance.ALLIES, name: 'Rzhev'},
        { x: 25, y: 10, points : 25000, owner: Alliance.ALLIES, name: 'Moscow'},
        { x: 19, y: 14, points : 5000, owner: Alliance.ALLIES, name: 'Smolensk'},
        { x: 42, y: 14, points : 5000, owner: Alliance.ALLIES, name: 'Saratov'},
        { x: 12, y: 16, points : 5000, owner: Alliance.ALLIES, name: 'Minsk'},
        { x: 24, y: 17, points : 5000, owner: Alliance.ALLIES, name: 'Kursk'},
        { x: 30, y: 17, points : 5000, owner: Alliance.ALLIES, name: 'Voronezh'},
        { x: 1, y: 19, points : 0, owner: Alliance.AXIS, name: 'Warsaw'},
        { x: 25, y: 23, points : 5000, owner: Alliance.ALLIES, name: 'Kharkiv'},
        { x: 39, y: 23, points : 15000, owner: Alliance.ALLIES, name: 'Stalingrad'},
        { x: 16, y: 24, points : 5000, owner: Alliance.ALLIES, name: 'Kiev'},
        { x: 25, y: 30, points : 5000, owner: Alliance.ALLIES, name: 'Donetsk'},
        { x: 33, y: 30, points : 5000, owner: Alliance.ALLIES, name: 'Rostov'},
        { x: 19, y: 33, points : 5000, owner: Alliance.ALLIES, name: 'Odessa'},
        { x: 33, y: 34, points : 5000, owner: Alliance.ALLIES, name: 'Krasnodar'}
    ];

    getGermanCityScore(): number {
        let score = 0;
        for ( const city of this.cities ) {
            if ( city.owner === Alliance.AXIS ) {
                score += city.points;
            }
        }
        console.log('German city score ',score);
        return score;
    }

    isCity(x: number, y: number): City {
        if ( this.getTerrainAt(x,y) !== Terrain.CITY ) {
            return null;
        }
        for ( const city of this.cities ) {
            if ( city.x === x && city.y === y ) {
                return city;
            }
        }
        console.log('Error for city at ',x,y);
    }

    getTheMap(): number[][] {
        return this.theMap;
    }

    getTerrain(location:Location): Terrain {
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
        } else if ( terrainCode >= 169 && terrainCode <= 189 ) {
            return Terrain.COAST;
        } else if ( terrainCode >= 190) {
            return Terrain.SEA; 
        } else {
            console.log('unmapped code : '+ terrainCode);
        }
    }
    
    checkPath(currentLocation: Location, location: Location): boolean {
        for ( const bad of this.badPaths ) {
            if ( currentLocation.x === bad[0] && currentLocation.y === bad[1] && location.x === bad[2] && location.y === bad[3] || 
                currentLocation.x === bad[2] && currentLocation.y === bad[3] && location.x === bad[0] && location.y === bad[1]
                ) {
                    return false;
                }
        }
        return true;
    }

}
