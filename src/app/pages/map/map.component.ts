import { Component, OnInit } from '@angular/core';
import { Terrain } from 'src/app/model/terrain';
import { MapService } from 'src/app/services/map.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    theMap: number[][];

    constructor(private mapService: MapService) {
        this.theMap = mapService.getTheMap();
     }

    ngOnInit() {
    }

    isCity(row, column) {
        return this.mapService.isCity(column,row);
    }


}
