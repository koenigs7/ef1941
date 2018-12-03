import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    theMap = [
        [191,191,191,169,0,0,0,0,0,0,0,0,180,191,191,170,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [191,191,191,175,178,0,0,0,181,182,184,183,182,179.187,176,0,0,0,0,0,0,0,0,0,0,0,0,0,],
        [191,191,191,191,175,184,183,185,191,191,182,184,183,182,179.187,176,0,0,0,0,0,0,0,0,0,0,0,0,0,]
    ]

    constructor() { }

    ngOnInit() {
    }

}
