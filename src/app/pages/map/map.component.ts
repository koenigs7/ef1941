import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    eightZeros = [0,0,0,0,0,0,0,0];
    sevenZeros = [0,0,0,0,0,0,0];

    theMap = [
        [191,191,191,169,0,0,0,0,0,0,0,0,180,191,191,170].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,175,178,0,0,0,181,182,184,183,182,179,187,176].concat(this.sevenZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,191,175,184,183,185,191,191,177,176,71,157,155].concat(this.eightZeros).concat(this.eightZeros).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,191,191,177,172,173,174,187,188,164,141,148,140].concat(this.eightZeros).concat([157,165,0,156,160,162,166,0]).concat(this.eightZeros).concat(this.sevenZeros),
        [191,191,191,191,191,171,0,0,0,186,178,152,142,149,1,5,0,0,0,0,0,0,0,148,145,161,154,0,0,146,159,165,0,0,0,0,156,164,0].concat(this.sevenZeros),
        [191,191,191,191,191,170,0,0,0,180,170,147,140,150,2,6,0,0,0,0,0,0,0,151,0,0,0,0,0,0,156,168,72,0,157,161,153,145,160,165,0,0,0,0,0,0],
        [191,191,191,191,191,175,178,0,0,0,176,149,139,151,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,145,160,159,155,0,0,0,73]

    ]


    constructor() {
     }

    ngOnInit() {
    }

}
