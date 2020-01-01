import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    static singleton: HeaderComponent = null;

    date = new Date(1942,6,6);
    score = 0;

    static incrementDate() {
        this.singleton.incrementDate();
    }


    constructor() { }

    ngOnInit() {
    }

    incrementDate() {

    }

}
