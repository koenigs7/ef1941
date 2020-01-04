import { Component, OnInit } from '@angular/core';
import { Alliance } from '../units/unit/unit.enums';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    static singleton: HeaderComponent = null;

    date = new Date(1941,5,22);
    score = 0;
    axisLosses = 0;
    alliesLosses = 0;
    gameState = 'Enter orders';

    static incrementDate() {
        this.singleton.incrementDate();
    }

    static incrementLosses(alliance: Alliance) {
        this.singleton.incrementLosses(alliance);
    }

    static setGameState(state: string) {
        this.singleton.gameState = state;
    }

    constructor() {
        HeaderComponent.singleton = this;
     }

    ngOnInit() {
    }

    incrementLosses(alliance: Alliance) {
        alliance === Alliance.ALLIES ? this.alliesLosses++ : this.axisLosses++;
    }

    incrementDate() {
        const tempDate = new Date(this.date.valueOf());
        tempDate.setDate(this.date.getDate() + 7);
        this.date = tempDate;
    }

}
