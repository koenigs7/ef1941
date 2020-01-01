import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    static singleton: HeaderComponent = null;

    date = new Date(1941,5,22);
    score = 0;

    static incrementDate() {
        this.singleton.incrementDate();
    }


    constructor() {
        HeaderComponent.singleton = this;
     }

    ngOnInit() {
    }

    incrementDate() {
        const tempDate = new Date(this.date.valueOf());
        tempDate.setDate(this.date.getDate() + 7);
        this.date = tempDate;
    }

}
